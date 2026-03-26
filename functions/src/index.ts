import * as admin from "firebase-admin";
import { onCall, HttpsError } from "firebase-functions/v2/https";

admin.initializeApp();

/**
 * Cloud Function callable: assegna il custom claim `shop_id` a un utente.
 * Da invocare solo da un admin/owner autenticato.
 */
export const setShopClaim = onCall(async (request) => {
  // Solo utenti già autenticati con un ruolo admin possono chiamare questa funzione
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Devi essere autenticato.");
  }

  const { targetUid, shopId } = request.data as {
    targetUid: string;
    shopId: string;
  };

  if (!targetUid || !shopId) {
    throw new HttpsError(
      "invalid-argument",
      "targetUid e shopId sono obbligatori."
    );
  }

  // Verifica che chi chiama sia owner del negozio
  const callerClaims = request.auth.token;
  if (callerClaims.shop_id !== shopId || callerClaims.role !== "owner") {
    throw new HttpsError(
      "permission-denied",
      "Solo il proprietario del negozio può aggiungere staff."
    );
  }

  await admin.auth().setCustomUserClaims(targetUid, {
    shop_id: shopId,
    role: "cashier",
  });

  return { success: true };
});

/**
 * Cloud Function callable: crea un nuovo negozio + assegna owner claim.
 * Pensata per essere invocata da un pannello admin o al primo setup.
 */
export const createShop = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Devi essere autenticato.");
  }

  const { shopName } = request.data as { shopName: string };
  if (!shopName) {
    throw new HttpsError("invalid-argument", "shopName è obbligatorio.");
  }

  const uid = request.auth.uid;

  // Crea il documento negozio
  const shopRef = admin.firestore().collection("shops").doc();
  await shopRef.set({
    name: shopName,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  // Assegna il custom claim owner
  await admin.auth().setCustomUserClaims(uid, {
    shop_id: shopRef.id,
    role: "owner",
  });

  // Aggiungi l'utente come staff/owner
  await shopRef.collection("staff").doc(uid).set({
    uid,
    displayName: request.auth.token.name ?? "",
    email: request.auth.token.email ?? "",
    role: "owner",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return { shopId: shopRef.id };
});
