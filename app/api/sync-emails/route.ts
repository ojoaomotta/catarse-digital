import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { ImapFlow, MailboxObject } from "imapflow";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export const maxDuration = 60;
export const dynamic = "force-dynamic";

function classifyCategory(subject: string): string {
  const text = subject.toLowerCase();
  if (text.includes("orçamento") || text.includes("orcamento") || text.includes("proposta") || text.includes("preço") || text.includes("valor") || text.includes("contratar"))
    return "Orcamento";
  if (text.includes("feedback") || text.includes("alteração") || text.includes("corte") || text.includes("edição") || text.includes("aprovação"))
    return "Feedback";
  return "Geral";
}

export async function GET() {
  const client = new ImapFlow({
    host: "imap.gmail.com",
    port: 993,
    secure: true,
    auth: {
      user: process.env.GMAIL_USER!,
      pass: process.env.GMAIL_APP_PASSWORD!,
    },
    logger: false,
    socketTimeout: 25000,
    greetingTimeout: 10000,
    connectionTimeout: 15000,
  });

  try {
    await client.connect();
    const lock = await client.getMailboxLock("INBOX");

    const emails: {
      sender: string;
      sender_email: string;
      subject: string;
      body: string;
      category: string;
      unread: boolean;
      created_at: string;
    }[] = [];

    try {
      // Calcula range dos últimos 20 e-mails com cast seguro
      const mb = client.mailbox as MailboxObject | false;
      const total = mb !== false ? mb.exists : 20;
      const start = Math.max(1, total - 19);
      const range = `${start}:${total}`;

      for await (const message of client.fetch(range, { envelope: true, flags: true })) {
        if (!message.envelope) continue;
        const env = message.envelope;
        const from = (env.from ?? [])[0];
        const senderName = from?.name || from?.address || "Desconhecido";
        const senderEmail = from?.address || "";
        const subject = env.subject ?? "(Sem assunto)";
        const date = env.date ?? new Date();
        const isUnread = !message.flags?.has("\\Seen");

        emails.push({
          sender: senderName,
          sender_email: senderEmail,
          subject,
          body: "(Abra o Gmail para ler o conteúdo completo → botão ↗ Abrir Gmail)",
          category: classifyCategory(subject),
          unread: isUnread,
          created_at: date.toISOString(),
        });
      }
    } finally {
      lock.release();
    }

    await client.logout();

    if (emails.length === 0)
      return NextResponse.json({ synced: 0, message: "Nenhum e-mail encontrado." });

    // Mais recentes primeiro
    emails.reverse();

    const { error } = await supabase
      .from("received_emails")
      .upsert(emails, { onConflict: "sender_email,subject", ignoreDuplicates: true });

    if (error) {
      console.error("Supabase upsert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ synced: emails.length });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("IMAP sync error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
