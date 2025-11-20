package db_helper;

public class SizedStack<T> extends Stack<T> {
	protected int maxSize = 16;
	public SizedStack(int size) {
		this.maxSize = size;
	}

	public resize(int new_size) {
		
	}
}
