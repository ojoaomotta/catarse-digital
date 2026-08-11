// Script de teste IMAP standalone — roda com: node test-imap.mjs
import { ImapFlow } from "imapflow";

const client = new ImapFlow({
  host: "imap.gmail.com",
  port: 993,
  secure: true,
  auth: {
    user: "contatocatarsefilm@gmail.com",
    pass: "ekrx kger vgum fsag",
  },
  logger: false,
  socketTimeout: 20000,
  greetingTimeout: 10000,
  connectionTimeout: 15000,
});

console.log("Conectando ao Gmail IMAP...");

try {
  await client.connect();
  console.log("✅ Conectado!");

  const lock = await client.getMailboxLock("INBOX");
  console.log("📬 Mailbox aberta:", client.mailbox?.exists, "e-mails no total");

  const total = client.mailbox?.exists ?? 5;
  const start = Math.max(1, total - 4);

  let count = 0;
  for await (const message of client.fetch(`${start}:${total}`, {
    envelope: true,
    flags: true,
  })) {
    if (!message.envelope) continue;
    const env = message.envelope;
    console.log(`  📧 [${count + 1}] De: ${env.from?.[0]?.address} | Assunto: ${env.subject}`);
    count++;
  }

  lock.release();
  await client.logout();
  console.log(`\n✅ Sucesso! ${count} e-mails encontrados.`);
} catch (err) {
  console.error("❌ Erro IMAP:", err.message);
}
