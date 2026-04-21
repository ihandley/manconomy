select id, display_name from public.users;
select * from public.users;

select private.apply_credit_ledger_entry(
  '289554dd-dcef-4906-b85a-3f1cd9f2dbcc',
  'earn',
  50,
  'test credits'
);