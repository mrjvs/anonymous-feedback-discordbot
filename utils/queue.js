class PromiseQueue {
	constructor() {
		this.queue = []
	}

	add(cb) {
		return new Promise((resolve, reject) => {
			this.queue.push(async () => {
				let res;
				try {
					res = cb();
					if (res instanceof Promise)
						res = await res
				} catch (err) {
					reject(err);
				}
				this.queue.shift();
				if (this.queue.length > 0) {
					this.queue[0]();
				}
				resolve(res);
			})
			if (this.queue.length <= 1)
				this.queue[0](); 
		})
	}
}

module.exports = {
	PromiseQueue
}
