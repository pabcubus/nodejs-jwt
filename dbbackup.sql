drop schema public cascade;

create schema public;

ALTER SCHEMA public OWNER TO nodejsuser;

CREATE TABLE person(
	id serial NOT NULL,
	username character varying(30),
	password character varying(500),
	creation timestamp without time zone,
	active boolean,
	CONSTRAINT user_pk PRIMARY KEY (id)
);

insert into person (username, password, creation, active) values ('test1', 'test1', current_timestamp, true);
