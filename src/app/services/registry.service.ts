import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { getAuth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { registryUser } from '../models/registryuser';

@Injectable({
  providedIn: 'root'
})
export class RegistryService {
  constructor(private firestore: Firestore) {}

  async registerUser(user: registryUser): Promise<void> {
    try {
      // AUTENTICAÇÃO NO FIREBASE AUTH
      const auth = getAuth();
      await createUserWithEmailAndPassword(auth, user.email, user.pass);

      // REMOVE A SENHA ANTES DE SALVAR NO FIRESTORE
      const { pass, ...userWithoutPassword } = user;

      // SALVA OS DADOS DO USUÁRIO NO FIRESTORE
      const docRef = await addDoc(collection(this.firestore, "Usuarios"), userWithoutPassword);
      console.log('Usuário registrado com sucesso. ID:', docRef.id);
    } catch (error: any) {
      // TRATAMENTO DE ERROS DETALHADOS
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('O e-mail fornecido já está em uso.');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('O e-mail fornecido é inválido.');
      } else if (error.code === 'auth/weak-password') {
        throw new Error('A senha deve ter pelo menos 6 caracteres.');
      } else {
        throw new Error('Erro ao registrar usuário. Tente novamente mais tarde.');
      }
    }
  }
}
