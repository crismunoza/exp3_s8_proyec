// firestore-mock.service.ts
export class FirestoreMock {
  collection() {
    return { valueChanges: () => [] };
  }

  doc() {
    return {
      update: () => Promise.resolve(),
      delete: () => Promise.resolve()
    };
  }
}
