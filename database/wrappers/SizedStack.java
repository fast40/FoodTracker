package db_helper;

import java.util.Stack;

public class SizedStack<T> extends Stack<T> {
	protected int maxSize = 16;
	public SizedStack(int size) {
		this.maxSize = size;
	}

	public resize(int new_size) {
		this.maxSize = new_size;
	}
	@Override
    public T push(T item) {
        if (this.size() >= maxSize) {
            this.remove(0);
        }
        return super.push(item);
    }
}
