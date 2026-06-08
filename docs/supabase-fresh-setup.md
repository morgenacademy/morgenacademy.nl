# Supabase Fresh Setup

Deze app verwacht meer dan alleen een `VITE_SUPABASE_URL` en publishable key. Voor een volledig nieuw Supabase-project heb je deze onderdelen nodig:

## Frontend env

Zet lokaal en in je hosting:

```env
VITE_SUPABASE_PROJECT_ID=fiquwpfscmmeqlpkrjjp
VITE_SUPABASE_URL=https://fiquwpfscmmeqlpkrjjp.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=...
```

## Database

Voer alle migrations uit uit `supabase/migrations/`.

Belangrijke functionele blokken:

- Academy checkout en toegang:
  `payments`, `course_enrollments`, `lesson_videos`, `user_roles`, `admin_grant_course_access`
- Leads en formulieren:
  `waitlist`, `incompany_requests`, `contact_requests`, `newsletter_signups`, `live_session_registrations`
- Klantportaal:
  `portal_companies`, `portal_trainings`, `portal_feedback`
  plus RPC's:
  `portal_set_password`, `portal_verify_password`, `portal_get_trainings`, `portal_submit_feedback`

## Storage buckets

Deze buckets moeten bestaan:

- `course-videos`
- `portal-slides`

De repo bevat migrations voor beide buckets en policies.

## Edge functions

Deploy deze functions:

- `create-mollie-payment`
- `mollie-webhook`
- `send-payment-email`
- `send-invoice-email`
- `send-catchup-emails`
- `bunny-videos`
- `seed-videos`
- `portal-download`

## Supabase secrets

Zet in het nieuwe project minstens:

```txt
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
SUPABASE_ANON_KEY
MOLLIE_API_KEY
RESEND_API_KEY
BUNNY_API_KEY
```

## Auth-instellingen

Controleer in Supabase Auth:

- `Site URL`
- redirect URL voor registratie/login
- redirect URL voor reset password:
  `https://jouwdomein/reset-password`

De app gebruikt:

- `signUp`
- `signInWithPassword`
- `resetPasswordForEmail`
- `updateUser`

## Eerste admin aanmaken

1. Maak zelf eerst een normaal account aan via de app.
2. Geef dat account daarna adminrechten in SQL:

```sql
insert into public.user_roles (user_id, role)
values ('JOUW_AUTH_USER_ID', 'admin')
on conflict (user_id, role) do nothing;
```

## Data die je eventueel wilt meenemen

Als je vanaf nul wilt starten, hoeft dit niet.

Als je wel wilt overzetten, zijn dit de relevante tabellen:

- `lesson_videos`
- `newsletter_signups`
- `waitlist`
- `contact_requests`
- `incompany_requests`
- `live_session_registrations`
- `portal_companies`
- `portal_trainings`
- `portal_feedback`

`payments` en `course_enrollments` kun je leeg laten als je opnieuw begint.

## Deploy-volgorde

1. Nieuw Supabase-project maken
2. `supabase link --project-ref <nieuw-project>`
3. `supabase db push`
4. functions deployen
5. secrets instellen
6. frontend env instellen
7. zelf account aanmaken
8. adminrol geven
9. testflow doen:
   registratie, login, checkout, gratis toegang geven, portaal login, feedback, slide-download
