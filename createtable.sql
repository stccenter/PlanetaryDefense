CREATE TABLE public.pd_pub_main
(
    id serial,
    pub_type character varying(2) COLLATE pg_catalog."default",
    pub_name character varying COLLATE pg_catalog."default",
    peer_reviewed boolean,
    title text COLLATE pg_catalog."default",
    doc_type character varying(30) COLLATE pg_catalog."default",
    author text COLLATE pg_catalog."default",
    author_full text COLLATE pg_catalog."default",
    institute text COLLATE pg_catalog."default",
    nation text COLLATE pg_catalog."default",
    keyword text COLLATE pg_catalog."default",
    keyword_plus text COLLATE pg_catalog."default",
    abstract text COLLATE pg_catalog."default",
    cite_num integer,
    month integer,
    year integer,
    doi text COLLATE pg_catalog."default",
    file_name text COLLATE pg_catalog."default",
    url text COLLATE pg_catalog."default",
    research_areas text COLLATE pg_catalog."default",
    reference_list text COLLATE pg_catalog."default"
)