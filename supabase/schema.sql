-- Esegui questo script nell'SQL Editor del tuo progetto Supabase
-- (Supabase dashboard → SQL Editor → New query → incolla → Run).

create table if not exists spaziodesk_data (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

-- Abilita gli aggiornamenti in tempo reale su questa tabella,
-- così le modifiche fatte da un dispositivo appaiono subito sull'altro.
-- (avvolto in un controllo così lo script è rieseguibile senza errori)
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and tablename = 'spaziodesk_data'
  ) then
    alter publication supabase_realtime add table spaziodesk_data;
  end if;
end $$;
