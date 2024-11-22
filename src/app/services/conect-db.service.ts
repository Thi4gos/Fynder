import { Injectable } from '@angular/core';
import { collection, collectionData, doc, getDoc, addDoc, updateDoc, deleteDoc, CollectionReference, WithFieldValue, DocumentData } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConectDBService {
  constructor(private firestore: AngularFireAuth) {}

  // MÉTODO GENÉRICO PARA OBTER UMA COLEÇÃO DO FIRESTORE
  getCollection<T extends DocumentData>(collectionName: string): Observable<T[]> {
    const collectionRef = collection(this.firestore, collectionName) as CollectionReference<T>;
    return collectionData(collectionRef, { idField: 'id' }); // Inclui o ID do documento
  }

  // MÉTODO GENÉRICO PARA OBTER UM DOCUMENTO PELO ID
  async getDocument<T extends DocumentData>(collectionName: string, documentId: string): Promise<T | undefined> {
    const documentRef = doc(this.firestore, `${collectionName}/${documentId}`);
    const docSnap = await getDoc(documentRef);

    if (docSnap.exists()) {
      // Retorna os dados do documento com o ID incluído
      return { ...(docSnap.data() as T), id: documentId } as T;
    }
    return undefined; // Retorna undefined se o documento não existir
  }

  // MÉTODO GENÉRICO PARA ADICIONAR DOCUMENTOS
  async addDocument<T extends WithFieldValue<DocumentData>>(collectionName: string, data: T): Promise<string> {
    const collectionRef = collection(this.firestore, collectionName);
    const docRef = await addDoc(collectionRef, data);
    return docRef.id; // Retorna o ID do documento criado
  }

  // MÉTODO GENÉRICO PARA ATUALIZAR DOCUMENTOS
  async updateDocument<T extends Partial<WithFieldValue<DocumentData>>>(collectionName: string, documentId: string, data: T): Promise<void> {
    const documentRef = doc(this.firestore, `${collectionName}/${documentId}`);
    await updateDoc(documentRef, data);
  }

  // MÉTODO GENÉRICO PARA DELETAR DOCUMENTOS
  async deleteDocument(collectionName: string, documentId: string): Promise<void> {
    const documentRef = doc(this.firestore, `${collectionName}/${documentId}`);
    await deleteDoc(documentRef);
  }
}
