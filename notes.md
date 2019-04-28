TODO:
- [x] Get click buttons into notifications
- [ ] Get hosted on AWS/heroku/google cloud

# Notes about Postgres

Working with pgadmin4

Found this tutorial that might help - https://linuxhint.com/pgadmin4_tutorial_beginners/

can also connect to the postgre database using command line 
- https://www.a2hosting.co.uk/kb/developer-corner/postgresql/connect-to-postgresql-from-the-command-line

`psql <database> <username>`
e.g. `psql postgres postgres`

connecting through psql console (installed on machine)
- Make connection `\c notificationdemo postgres localhost 5433`


through pgAdmin4 -
Able to add items to database using the query
- INSERT INTO subscriptions(sub_object) VALUES ('{"test":"thing"}')

# Notes about hosting

- Worth trying AWS?
  - research to see how easy is is to get databases on AWS
  - this tutorial - https://aws.amazon.com/getting-started/tutorials/create-connect-postgresql-db/
- Using postgre sql because thats what heroku has?
