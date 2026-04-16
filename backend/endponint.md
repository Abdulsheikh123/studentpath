postsql mai id reset krne ke liye  dubra 1 se start hongi ager forigin key ha to
TRUNCATE TABLE cities RESTART IDENTITY CASCADE;
or
TRUNCATE TABLE cities RESTART IDENTITY;

TRUNCATE TABLE "University" RESTART IDENTITY CASCADE;
TRUNCATE TABLE "College" RESTART IDENTITY CASCADE;
TRUNCATE TABLE "StandaloneInstitute" RESTART IDENTITY CASCADE;
TRUNCATE TABLE universities RESTART IDENTITY CASCADE;


cities 
GET    /api/cities
GET    /api/cities/:id
POST   /api/cities
PUT    /api/cities/:id
DELETE /api/cities/:id 