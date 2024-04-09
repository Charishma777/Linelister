create database mini;
use mini;
create table Signin(username varchar(30),pass varchar(30));
desc Signin;
drop table Signin;
create table Register(username varchar(30),email varchar(50),password varchar(30));
insert into Register values("cherry","cherry@gmail.com","12345");
drop table Register;

ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'AP35AC8455@c';
