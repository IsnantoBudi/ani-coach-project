-- 1. Alter quests table to include stat rewards
ALTER TABLE public.quests ADD COLUMN IF NOT EXISTS boost_str integer NOT NULL DEFAULT 0;
ALTER TABLE public.quests ADD COLUMN IF NOT EXISTS boost_int integer NOT NULL DEFAULT 0;
ALTER TABLE public.quests ADD COLUMN IF NOT EXISTS boost_vit integer NOT NULL DEFAULT 0;
ALTER TABLE public.quests ADD COLUMN IF NOT EXISTS boost_agi integer NOT NULL DEFAULT 0;
ALTER TABLE public.quests ADD COLUMN IF NOT EXISTS boost_chr integer NOT NULL DEFAULT 0;

-- 2. Add index for faster quest lookups
CREATE INDEX IF NOT EXISTS idx_quests_user_id_status ON public.quests(user_id, status);
