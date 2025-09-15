CREATE OR REPLACE VIEW clients_view AS
SELECT
    c.id AS client_id,
    c.state AS client_state,
    c.password AS client_password,
    c.created_at AS client_created_at,
    c.updated_at AS client_updated_at,
    p.id AS person_id,
    p.name AS person_name,
    p.gender AS person_gender,
    p.age AS person_age,
    p.identification AS person_identification,
    p.address AS person_address,
    p.phone AS person_phone,
    p.created_at AS person_created_at,
    p.updated_at AS person_updated_at
FROM
    clients c
    JOIN people p ON c.person_id = p.id;

