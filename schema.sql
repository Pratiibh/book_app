DROP TABLE IF EXISTS book_app;

CREATE TABLE book_app(
    id SERIAL PRIMARY KEY,
    title VARCHAR(2550),
    authors VARCHAR(2550),
    description VARCHAR(2550),
    image_link VARCHAR(2550),
    isbn VARCHAR(2550),
    bookshelf VARCHAR(2550)
)

