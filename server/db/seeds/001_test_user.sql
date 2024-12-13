-- Password is "Test@123" (hashed with bcrypt)
INSERT INTO users (
    email,
    password,
    name,
    email_verified,
    verification_token,
    verification_token_expires,
    reset_token,
    reset_token_expires
) VALUES (
    'test@example.com',
    '$2a$10$rQnZ9l8L93zMjMlL7VhzHeRcwKVE0LB3YzRnUHhFZGW0dI/qQTyEi',
    'Test User',
    true,
    NULL,
    NULL,
    NULL,
    NULL
) ON CONFLICT (email) DO NOTHING;
