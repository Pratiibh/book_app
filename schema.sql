DROP TABLE IF EXISTS book_app;

CREATE TABLE book_app(
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    authors VARCHAR(255),
    description VARCHAR(255),
    image_link VARCHAR(255),
    isbn VARCHAR(255),
    bookshelf VARCHAR(255)
)

