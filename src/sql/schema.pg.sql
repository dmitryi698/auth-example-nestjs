DROP DATABASE IF EXISTS nest_test_auth;
create database nest_test_auth;
CREATE USER nest_test_auth WITH PASSWORD 'nest_test_auth';
GRANT ALL PRIVILEGES ON DATABASE nest_test_auth to nest_test_auth;
ALTER USER nest_test_auth CREATEDB;
ALTER DATABASE nest_test_auth OWNER TO nest_test_auth;
