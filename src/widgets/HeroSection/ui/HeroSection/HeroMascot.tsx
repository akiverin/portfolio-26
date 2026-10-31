import mascot from 'assets/hero/mascot-ascii-3d.webp';

const HeroMascot = () => (
  <span data-mascot-art="" data-ascii-mascot="">
    <img src={mascot} width={512} height={512} alt="" draggable={false} />
    <img src={mascot} width={512} height={512} alt="" draggable={false} data-ascii-glint="" />
  </span>
);

export default HeroMascot;
