docker file build ke liye
docker-compose -f docker-compose.local.yml up --build
docker-compose -f docker-compose.prod.yml up --build

up -> all container ko ak sath run karta hai
--build-> ye docker ko bolta hai file(DockerFile) mai change hua hai to new build bnao
-d -> ye optional hota hai terminal free rakh ne ke liye background mai run hota rahe
docker-compose -f docker-compose.prod.yml up --build

--build -> ye command ager local per work kar rahe ho to (dev) to app ko code change karne per bar bar build karne ki jarurt nhi hai sirf ak bar but ager koi package install kara like (npm install axios) to app ko dubara build karna honga

ager ye server(prod) per hai to code mai change karne per bar bar run karni hongi
docker-compose -f docker-compose.prod.yml up --build

Bugs
docker-compose -f docker-compose.local.yml logs -f
-f -> new logs real time bale daikh na

stop container
docker-compose -f docker-compose.local.yml down
down-> ye service/container ko stop kar dega

docker-compose ps
docker-compose -f docker-compose.local.yml ps
ps --> status bta ti hai ye bta ti hai conse container chal rahe hai konse band hai
ager container (Up) hai to run/chalu hai
ager container (Exit) hai to stop/band hai

docker-compose ps -a
-a --> all dikha ta hai band,run,or crash inko bhi dikha ta hai

start vs stop vs restart
stop->Containers ko bina delete kiye pause/stop kar deta hai.
docker-compose -f docker-compose.local.yml stop

start -> Jo containers stop hue the, unhe wapas chalu kar deta hai (ye build nahi karta, sirf engine chalu karta hai).
docker-compose -f docker-compose.local.yml start

restart-> Agar backend hang ho jaye, toh use fatfat restart karne ke liye.
docker-compose -f docker-compose.local.yml restart backend

Poore Docker System ki Safayi
docker system prune -a --volumes

docker logs -f studentpath_be_local
docker logs -f studentpath_fe_local
