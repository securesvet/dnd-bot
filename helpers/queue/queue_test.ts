import { assertEquals } from "jsr:@std/assert";
import { Queue } from "./index.ts"; // Adjust the import path as necessary

Deno.test("Queue: isEmpty on an empty queue", () => {
  const queue = new Queue<number>();
  assertEquals(queue.isEmpty(), true, "Queue should be empty initially");
});

Deno.test("Queue: enqueue operation", () => {
  const queue = new Queue<number>();
  queue.enqueue(10);
  assertEquals(
    queue.isEmpty(),
    false,
    "Queue should not be empty after enqueue",
  );
  assertEquals(
    queue.getFront(),
    10,
    "Front should return the first element enqueued",
  );
  assertEquals(
    queue.getRear(),
    10,
    "Rear should return the last element enqueued",
  );
});

Deno.test("Queue: enqueue multiple elements", () => {
  const queue = new Queue<number>();
  queue.enqueue(10);
  queue.enqueue(20);
  queue.enqueue(30);
  assertEquals(
    queue.getFront(),
    10,
    "Front should return the first element enqueued",
  );
  assertEquals(
    queue.getRear(),
    30,
    "Rear should return the last element enqueued",
  );
});

Deno.test("Queue: dequeue operation", () => {
  const queue = new Queue<number>();
  queue.enqueue(10);
  queue.enqueue(20);
  const dequeued = queue.dequeue();
  assertEquals(
    dequeued?.data,
    10,
    "Dequeue should return the first element enqueued",
  );
  assertEquals(
    queue.getFront(),
    20,
    "Front should now be the second element enqueued",
  );
});

Deno.test("Queue: dequeue until empty", () => {
  const queue = new Queue<number>();
  queue.enqueue(10);
  queue.enqueue(20);
  queue.dequeue();
  queue.dequeue();
  assertEquals(
    queue.isEmpty(),
    true,
    "Queue should be empty after all elements are dequeued",
  );
  assertEquals(
    queue.getFront(),
    null,
    "Front should be null on an empty queue",
  );
  assertEquals(queue.getRear(), null, "Rear should return null on empty queue");
});

Deno.test("Queue: getFront and getRear on empty queue", () => {
  const queue = new Queue<number>();
  assertEquals(
    queue.getFront(),
    null,
    "Front should return null on an empty queue",
  );
  assertEquals(queue.getRear(), null, "Rear should return null on empty queue");
});

Deno.test("Queue: order is preserved", () => {
  const queue = new Queue<string>();
  queue.enqueue("first");
  queue.enqueue("second");
  queue.enqueue("third");
  assertEquals(
    queue.dequeue()?.data,
    "first",
    "The first dequeued element should be the first enqueued",
  );
  assertEquals(
    queue.dequeue()?.data,
    "second",
    "The second dequeued element should be the second enqueued",
  );
  assertEquals(
    queue.dequeue()?.data,
    "third",
    "The third dequeued element should be the third enqueued",
  );
});
