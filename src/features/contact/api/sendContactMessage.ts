import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from 'shared/api/firebase';
import { BaseResponse } from 'shared/api/types';

export type ContactMessage = {
  name: string;
  email: string;
  message: string;
};

export const sendContactMessage = async (
  data: ContactMessage,
): Promise<BaseResponse<void>> => {
  try {
    await addDoc(collection(db, 'messages'), {
      ...data,
      createdAt: serverTimestamp(),
    });
    return { isError: false, data: undefined };
  } catch (error) {
    return { isError: true, data: null, error };
  }
};
