/* eslint-disable react/prop-types */
import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "../ui/button";

import { v4 as uuidv4 } from "uuid";

export default function RequestForm({ books, setBooks, socket }) {
  const [isbn, setIsbn] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (isbn < 5) {
      setError("ISBN contains more characters");
      return;
    }
    if (quantity == 0) {
      setError("Quantity cannot be 0");
      return;
    }

    const newBook = {
      id: uuidv4(),
      isbn,
      quantity: parseInt(quantity, 10),
      status: "requested",
    };
    socket.emit("book_request", newBook);

    setBooks([...books, newBook]);

    setIsbn("");
    setQuantity(1);
  };

  return (
    <div className="py-8">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col md:flex-row justify-center items-center space-x-2"
      >
        <div className="flex flex-col space-y-1">
          <Label htmlFor="isbn">ISBN</Label>
          <Input
            id="isbn"
            type="text"
            placeholder="ISBN"
            value={isbn}
            onChange={(e) => setIsbn(e.target.value)}
            className="w-40"
          ></Input>
        </div>
        <div className="flex flex-col space-y-1">
          <Label htmlFor="quantity">Quantity</Label>
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input
              id="quantity"
              type="number"
              placeholder="Qty"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-20"
            ></Input>
            <Button type="submit">Send</Button>
          </div>
        </div>
      </form>
      <div className="flex justify-center">
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
}
