"use node";

import { action } from "./_generated/server";

import { v } from "convex/values";
import { JWT } from "google-auth-library";

export const sendPushNotification = action({
  args: {
    token: v.string(),
    title: v.string(),
    body: v.string(),
    data: v.optional(v.any()),
  },
  handler: async (_ctx, args) => {

    const serviceAccountStr = process.env.FIREBASE_SERVICE_ACCOUNT;
    if (!serviceAccountStr) {
      console.error("FIREBASE_SERVICE_ACCOUNT no configurada en Convex");
      return;
    }

    try {
      const serviceAccount = JSON.parse(serviceAccountStr);
      
      // Obtener token de acceso para la API de FCM v1
      const jwtClient = new JWT({
        email: serviceAccount.client_email,
        key: serviceAccount.private_key,
        scopes: ["https://www.googleapis.com/auth/firebase.messaging"],
      });

      const { token } = await jwtClient.getAccessToken();
      if (!token) throw new Error("No se pudo obtener el token de acceso");

      // Enviar la notificación vía API REST de FCM v1
      const projectId = serviceAccount.project_id;
      const response = await fetch(
        `https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: {
              token: args.token,
              notification: {
                title: args.title,
                body: args.body,
              },
              data: args.data || {},
              android: {
                priority: "high",
                notification: {
                  sound: "default",
                  channel_id: "default",
                }
              },
              apns: {
                payload: {
                  aps: {
                    sound: "default",
                  }
                }
              }
            },
          }),
        }
      );

      const result = await response.json();
      if (!response.ok) {
        console.error("Error enviando FCM:", result);
      } else {
        console.log("Notificación enviada con éxito:", result);
      }
    } catch (error) {
      console.error("Error en el proceso de notificación push:", error);
    }
  },
});

