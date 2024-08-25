import { useEffect, useState } from "react";
import io from "socket.io-client";

import RequestForm from "@/components/features/RequestForm";
import RequestTable from "@/components/features/RequestTable";

import { Toaster } from "@/components/ui/toaster";

const socket = io.connect(`${import.meta.env.URL}`);

export default function Home() {
  const [books, setBooks] = useState([]);

  const getRequests = async () => {
    try {
      const response = await fetch(`${import.meta.env.URL}/requests`);
      const data = await response.json();
      setBooks(data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getRequests();
  }, []);

  useEffect(() => {
    socket.on("receive_request", (data) => {
      setBooks((prevBooks) => [...prevBooks, data]);
    });

    socket.on("book_deleted", (id) => {
      setBooks((prevBooks) => prevBooks.filter((book) => book.id !== id));
    });

    socket.on("status_changed", (updatedBook) => {
      setBooks((prevBooks) =>
        prevBooks.map((book) =>
          book.id === updatedBook.id ? updatedBook : book
        )
      );
    });

    return () => {
      socket.off("receive_request");
      socket.off("book_deleted");
      socket.off("status_changed");
    };
  }, []);

  return (
    <div>
      <RequestForm books={books} setBooks={setBooks} socket={socket} />
      <RequestTable books={books} setBooks={setBooks} socket={socket} />
      <Toaster />
    </div>
  );
}
