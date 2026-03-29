import { saveAs } from 'file-saver';

export type ExportAchievement = {
  id: string;
  title: string;
  desc: string;
  date?: { seconds: number } | null;
  cover?: string;
};

type TimeRange = 'year' | '2years' | 'all';
type ExportFormat = 'csv' | 'excel' | 'txt' | 'zip';

const filterByRange = (items: ExportAchievement[], range: TimeRange): ExportAchievement[] => {
  if (range === 'all') return items;
  const now = Date.now();
  const ms = range === 'year' ? 365.25 * 24 * 3600 * 1000 : 2 * 365.25 * 24 * 3600 * 1000;
  return items.filter((a) => {
    if (!a.date || typeof a.date !== 'object' || !('seconds' in a.date)) return false;
    return now - a.date.seconds * 1000 < ms;
  });
};

const formatDate = (date?: { seconds: number } | null): string => {
  if (!date || typeof date !== 'object' || !('seconds' in date)) return '';
  return new Date(date.seconds * 1000).toLocaleDateString('ru-RU', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
};

const toTxt = (items: ExportAchievement[]): string =>
  items.map((a) => `• ${a.title} (${a.desc})`).join(';\n') + '.';

const toCsv = (items: ExportAchievement[]): string => {
  const escape = (s: string) => `"${s.replace(/"/g, '""')}"`;
  const header = 'Название,Описание,Дата';
  const rows = items.map((a) => [escape(a.title), escape(a.desc), escape(formatDate(a.date))].join(','));
  return [header, ...rows].join('\n');
};

export async function exportAchievements(
  items: ExportAchievement[],
  range: TimeRange,
  format: ExportFormat,
): Promise<void> {
  const filtered = filterByRange(items, range);
  if (filtered.length === 0) return;

  if (format === 'txt') {
    const blob = new Blob([toTxt(filtered)], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, 'achievements.txt');
    return;
  }

  if (format === 'csv') {
    const blob = new Blob(['\ufeff' + toCsv(filtered)], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, 'achievements.csv');
    return;
  }

  if (format === 'excel') {
    const { utils, writeFile } = await import('xlsx');
    const ws = utils.json_to_sheet(
      filtered.map((a) => ({
        'Название': a.title,
        'Описание': a.desc,
        'Дата': formatDate(a.date),
      })),
    );
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Достижения');
    writeFile(wb, 'achievements.xlsx');
    return;
  }

  if (format === 'zip') {
    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();
    zip.file('achievements.txt', toTxt(filtered));

    const imgFolder = zip.folder('images');
    if (imgFolder) {
      const fetches = filtered
        .filter((a): a is ExportAchievement & { cover: string } => Boolean(a.cover))
        .map(async (a) => {
          try {
            const cover = a.cover;
            const url = `https://andkiv.com/assets/achievements/${cover}`;
            const resp = await fetch(url);
            if (!resp.ok) return;
            const blob = await resp.blob();
            const ext = cover.split('.').pop() || 'jpg';
            const safeName = a.title.replace(/[^a-zA-Zа-яА-Я0-9]/g, '_').slice(0, 50);
            imgFolder.file(`${safeName}.${ext}`, blob);
          } catch {
            // skip failed images
          }
        });
      await Promise.allSettled(fetches);
    }

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    saveAs(zipBlob, 'achievements.zip');
  }
}
