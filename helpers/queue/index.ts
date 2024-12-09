export class Node<T> {
  public next: Node<T> | null;
  public data: T | null;

  constructor(new_data: T) {
    this.data = new_data;
    this.next = null;
  }
}

export class Queue<T> {
  private front: Node<T> | null;
  private rear: Node<T> | null;
  constructor() {
    this.front = null;
    this.rear = null;
  }

  isEmpty() {
    return this.front === null && this.rear === null;
  }

  enqueue(newData: T) {
    const newNode = new Node<T>(newData);

    if (this.rear === null) {
      this.front = this.rear = newNode;
      return;
    }

    this.rear.next = newNode;
    this.rear = newNode;
    return this.rear;
  }

  dequeue() {
    if (this.isEmpty()) {
      return null;
    }
    const temp = this.front;
    this.front = this.front!.next;

    if (this.front === null) {
      this.rear = null;
    }
    return temp;
  }

  getFront() {
    if (this.isEmpty()) {
      return null;
    }
    return this.front!.data;
  }

  getRear() {
    if (this.isEmpty()) {
      return null;
    }
    return this.rear!.data;
  }
}
