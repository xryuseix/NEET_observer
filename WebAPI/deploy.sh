git init
heroku git:remote -a neet-obserber
git add .
git commit -m 'make it better!'
git push -f heroku master
rm -rf .git