const FoEproxy2 = (function () {
	const requestInfoHolder = new WeakMap();
	function getRequestData(xhr) {
		let data = requestInfoHolder.get(xhr);
		if (data != null) return data;

		data = { url: null, method: null, postData: null };
		requestInfoHolder.set(xhr, data);
		return data;
	}

	let proxyEnabled = true;

	// XHR-handler
	/** @type {Record<string, undefined|Record<string, undefined|((data: FoE_NETWORK_TYPE, postData: any) => void)[]>>} */
	const proxyMap = {};
	const proxyRequestsMap = {};

	/** @type {Record<string, undefined|((data: any, requestData: any) => void)[]>} */
	const proxyMetaMap = {};

	/** @type {((data: any, requestData: any) => void)[]} */
	let proxyRaw = [];

	// Websocket-Handler
	const wsHandlerMap = {};
	let wsRawHandler = [];

	// startup Queues
	let xhrQueue = [];
	let wsQueue = [];

	const proxy = {
		/**
		 * Fügt einen datenhandler für Antworten von game/json hinzu.
		 * @param {string} service Der Servicewert, der in der Antwort gesetzt sein soll oder 'all'
		 * @param {string} method Der Methodenwert, der in der Antwort gesetzt sein soll oder 'all'
		 * TODO: Genaueren Typ für den Callback definieren
		 * @param {(data: FoE_NETWORK_TYPE, postData: any) => void} callback Der Handler, welcher mit der Antwort aufgerufen werden soll.
		 */
		addHandler: function (service, method, callback) {
			// default service and method to 'all'
			if (method === undefined) {
				// @ts-ignore
				callback = service;
				service = method = 'all';
			} else if (callback === undefined) {
				// @ts-ignore
				callback = method;
				method = 'all';
			}

			let map = proxyMap[service];
			if (!map) {
				proxyMap[service] = map = {};
			}
			let list = map[method];
			if (!list) {
				map[method] = list = [];
			}
			if (list.indexOf(callback) !== -1) {
				// already registered
				return;
			}
			list.push(callback);
		},

		removeHandler: function (service, method, callback) {
			// default service and method to 'all'
			if (method === undefined) {
				callback = service;
				service = method = 'all';
			} else if (callback === undefined) {
				callback = method;
				method = 'all';
			}

			let map = proxyMap[service];
			if (!map) {
				return;
			}
			let list = map[method];
			if (!list) {
				return;
			}
			map[method] = list.filter(c => c !== callback);
		},

		// for metadata requests: metadata?id=<meta>-<hash>
		addMetaHandler: function (meta, callback) {
			let list = proxyMetaMap[meta];
			if (!list) {
				proxyMetaMap[meta] = list = [];
			}
			if (list.indexOf(callback) !== -1) {
				// already registered
				return;
			}

			list.push(callback);
		},

		removeMetaHandler: function (meta, callback) {
			let list = proxyMetaMap[meta];
			if (!list) {
				return;
			}
			proxyMetaMap[meta] = list.filter(c => c !== callback);
		},

		// for raw requests access
		addRawHandler: function (callback) {
			if (proxyRaw.indexOf(callback) !== -1) {
				// already registered
				return;
			}

			proxyRaw.push(callback);
		},

		removeRawHandler: function (callback) {
			proxyRaw = proxyRaw.filter(c => c !== callback);
		},

		/**
		 
		  @param {string} service
		  @param {string} method 
		 
		 * @param {(data: FoE_NETWORK_TYPE) => void} callback 
		 */
		addWsHandler: function (service, method, callback) {
			// default service and method to 'all'
			if (method === undefined) {
				// @ts-ignore
				callback = service;
				service = method = 'all';
			} else if (callback === undefined) {
				// @ts-ignore
				callback = method;
				method = 'all';
			}

			let map = wsHandlerMap[service];
			if (!map) {
				wsHandlerMap[service] = map = {};
			}
			let list = map[method];
			if (!list) {
				map[method] = list = [];
			}
			if (list.indexOf(callback) !== -1) {
				// already registered
				return;
			}
			list.push(callback);
		},

		removeWsHandler: function (service, method, callback) {
			// default service and method to 'all'
			if (method === undefined) {
				callback = service;
				service = method = 'all';
			} else if (callback === undefined) {
				callback = method;
				method = 'all';
			}

			let map = wsHandlerMap[service];
			if (!map) {
				return;
			}
			let list = map[method];
			if (!list) {
				return;
			}
			map[method] = list.filter(c => c !== callback);
		},

		addFoeHelperHandler: function (method, callback) {
			this.addWsHandler('FoeHelperService', method, callback);
		},

		removeFoeHelperHandler: function (method, callback) {
			this.removeWsHandler('FoeHelperService', method, callback);
		},

		// for raw requests access
		addRawWsHandler: function (callback) {
			if (wsRawHandler.indexOf(callback) !== -1) {
				// already registered
				return;
			}

			wsRawHandler.push(callback);
		},

		removeRawWsHandler: function (callback) {
			wsRawHandler = wsRawHandler.filter(c => c !== callback);
		},

		pushFoeHelperMessage: function (method, data = null) {
			_proxyWsAction('FoeHelperService', method, data);
			_proxyWsAction('FoeHelperService', method, data);
		},
	
		addRequestHandler: function (service, method, callback) {
			// default service and method to 'all'
			if (method === undefined) {
				// @ts-ignore
				callback = service;
				service = method = 'all';
			} else if (callback === undefined) {
				// @ts-ignore
				callback = method;
				method = 'all';
			}

			let map = proxyRequestsMap[service];
			if (!map) {
				proxyRequestsMap[service] = map = {};
			}
			let list = map[method];
			if (!list) {
				map[method] = list = [];
			}
			if (list.indexOf(callback) !== -1) {
				// already registered
				return;
			}
			list.push(callback);
		},

		removeRequestHandler: function (service, method, callback) {
			// default service and method to 'all'
			if (method === undefined) {
				callback = service;
				service = method = 'all';
			} else if (callback === undefined) {
				callback = method;
				method = 'all';
			}

			let map = proxyRequestsMap[service];
			if (!map) {
				return;
			}
			let list = map[method];
			if (!list) {
				return;
			}
			map[method] = list.filter(c => c !== callback);
		}
	};

	window.addEventListener('foe-helper#loaded', () => {
		const xhrQ = xhrQueue;
		xhrQueue = null;
		const wsQ = wsQueue;
		wsQueue = null;

		xhrQ.forEach(xhrRequest => xhrOnLoadHandler.call(xhrRequest));
		wsQ.forEach(wsMessage => wsMessageHandler(wsMessage));
	}, { capture: false, once: true, passive: true });

	window.addEventListener('foe-helper#error-loading', () => {
		xhrQueue = null;
		wsQueue = null;
		proxyEnabled = false;
	}, { capture: false, once: true, passive: true });

	// ###########################################
	// ############## Websocket-Proxy ############
	// ###########################################
	/**
	 * This function gets the callbacks from wsHandlerMap[service][method] and executes them.
	 * @param {string} service
	 * @param {string} method
	 * @param {FoE_NETWORK_TYPE} data
	 */
	function _proxyWsAction(service, method, data) {
		const map = wsHandlerMap[service];
		if (!map) {
			return;
		}
		const list = map[method];
		if (!list) {
			return;
		}
		for (let callback of list) {
			try {
				callback(data);
			} catch (e) {
				console.error(e);
			}
		}
	}

	/**
	 * This function gets the callbacks from wsHandlerMap[service][method],wsHandlerMap[service]['all'],wsHandlerMap['all'][method] and wsHandlerMap['all']['all'] and executes them.
	 * @param {string} service
	 * @param {string} method
	 * @param {FoE_NETWORK_TYPE} data
	 */
	function proxyWsAction(service, method, data) {
		_proxyWsAction(service, method, data);
		_proxyWsAction('all', method, data);
		_proxyWsAction(service, 'all', data);
		_proxyWsAction('all', 'all', data);
	}

	/**
	 * @this {WebSocket}
	 * @param {MessageEvent} evt
	 */
	function wsMessageHandler(evt) {
		if (wsQueue) { 
			wsQueue.push(evt);
			return;
		}
		try {
			if (evt.data === 'PONG') return;
			/** @type {FoE_NETWORK_TYPE[]|FoE_NETWORK_TYPE} */
			const data = JSON.parse(evt.data);

			// do raw-ws-handlers
			for (let callback of wsRawHandler) {
				try {
					callback(data);
					saveJsonDataToLocalStorage('testData', 5); // Replace 'someKey' with your desired key
				} catch (e) {
					console.error(e);
				}
			}

			// do ws-handlers
			if (data instanceof Array) {
				for (let entry of data) {
					proxyWsAction(entry.requestClass, entry.requestMethod, entry);
				}
			} else if (data.__class__ === "ServerResponse") {
				proxyWsAction(data.requestClass, data.requestMethod, data);
			}
		} catch (e) {
			console.error(e);
		}
	}

	// Attention. The WebSocket.prototype.send function is not replaced back if other code also replaces the prototype
	const observedWebsockets = new WeakSet();
	const oldWSSend = WebSocket.prototype.send;
	WebSocket.prototype.send = function (data) {
		oldWSSend.call(this, data);
		if (proxyEnabled && !observedWebsockets.has(this)) {
			observedWebsockets.add(this);
			this.addEventListener('message', wsMessageHandler, { capture: false, passive: true });
		}
	};

	// ###########################################
	// ################# XHR-Proxy ###############
	// ###########################################

	/**
	 * This function gets the callbacks from proxyMap[service][method] and executes them.
	 */
	 function _proxyAction(service, method, data, postData) {
		const map = proxyMap[service];
		if (!map) {
			return;
		}
		const list = map[method];
		if (!list) {
			return;
		}
		for (let callback of list) {
			try {
				callback(data, postData);
				 // Save the JSON data to local storage after handling it
				 saveJsonDataToLocalStorage('PLEASEWORKDADDY', 'test'); // Replace 'someKey' with your desired key
			} catch (e) {
				console.error(e);
			}
		}
	}

	// Function to save JSON data in localStorage
	function saveJsonDataToLocalStorage(key, jsonData) {
	// Convert the JSON data to a string before saving
	const jsonString = JSON.stringify(jsonData);
	localStorage.setItem(key, jsonString);
  }
  
	/**
	 * This function gets the callbacks from proxyMap[service][method],proxyMap[service]['all'] and proxyMap['all']['all'] and executes them.
	 */
	function proxyAction(service, method, data, postData) {
		let filteredPostData = postData.filter(r => r && r.requestId && data && data.requestId && r.requestId === data.requestId); //Nur postData mit zugehöriger requestId weitergeben

		_proxyAction(service, method, data, filteredPostData);
		_proxyAction('all', method, data, filteredPostData);
		_proxyAction(service, 'all', data, filteredPostData);
		_proxyAction('all', 'all', data, filteredPostData);
	}

	/**
	 * This function gets the callbacks from proxyRequestsMap[service][method] and executes them.
	 */
	 function _proxyRequestAction(service, method, postData) {
		const map = proxyRequestsMap[service];
		if (!map) {
			return;
		}
		const list = map[method];
		if (!list) {
			return;
		}
		for (let callback of list) {
			try {
				callback(postData);
			} catch (e) {
				console.error(e);
			}
		}
	}

	/**
	 * This function gets the callbacks from proxyRequestsMap[service][method],proxyRequestsMap[service]['all'] and proxyRequestsMap['all']['all'] and executes them.
	 */
	function proxyRequestAction(service, method, postData) {
		_proxyRequestAction(service, method, postData);
		_proxyRequestAction('all', method, postData);
		_proxyRequestAction(service, 'all', postData);
		_proxyRequestAction('all', 'all', postData);
	}

	// Achtung! Die XMLHttpRequest.prototype.open und XMLHttpRequest.prototype.send funktionen werden nicht zurück ersetzt,
	//          falls anderer code den prototypen auch austauscht.
	const XHR = XMLHttpRequest.prototype,
		open = XHR.open,
		send = XHR.send;

	/**
	 * @param {string} method
	 * @param {string} url
	 */
	XHR.open = function (method, url) {
		if (proxyEnabled) {
			const data = getRequestData(this);
			data.method = method;
			data.url = url;
		}
		// @ts-ignore
		return open.apply(this, arguments);
	};

	/**
	 * @this {XHR}
	 */
	 function xhrOnLoadHandler() {
		if (!proxyEnabled) return;

		if (xhrQueue) {
			xhrQueue.push(this);
			return;
		}

		const requestData = getRequestData(this);
		const url = requestData.url;
		const postData = requestData.postData;

		// handle raw request handlers
		for (let callback of proxyRaw) {
			try {
				callback(this, requestData);
			} catch (e) {
				console.error(e);
			}
		}

		// handle metadata request handlers
		const metadataIndex = url.indexOf("metadata?id=");

		if (metadataIndex > -1) {
			const metaURLend = metadataIndex + "metadata?id=".length,
				metaArray = url.substring(metaURLend).split('-', 2),
				meta = metaArray[0];

			MainParser.MetaIds[meta] = metaArray[1];

			const metaHandler = proxyMetaMap[meta];

			if (metaHandler) {
				for (let callback of metaHandler) {
					try {
						callback(this, postData);
					} catch (e) {
						console.error(e);
					}
				}
			}
		}

		// nur die jSON mit den Daten abfangen
		if (url.indexOf("game/json?h=") > -1) {

			// Only process JSONs with 'greatbuildings' in the URL
			//  if (url.indexOf('greatbuildings') > -1) {

			let d = /** @type {FoE_NETWORK_TYPE[]} */(JSON.parse(this.responseText));

			let requestData = postData;

			try {
				requestData = JSON.parse(new TextDecoder().decode(postData));
				// StartUp Service zuerst behandeln
				for (let entry of d) {
					if (entry['requestClass'] === 'StartupService' && entry['requestMethod'] === 'getData') {
						proxyAction(entry.requestClass, entry.requestMethod, entry, requestData);
					}
				}

				for (let entry of d) {
					if (!(entry['requestClass'] === 'StartupService' && entry['requestMethod'] === 'getData')) {
						proxyAction(entry.requestClass, entry.requestMethod, entry, requestData);
					}
				}

			} catch (e) {
				console.log('Can\'t parse postData: ', postData);
			}
		   
		// }
		}
	}

	function xhrOnSend(data) {
		if (!proxyEnabled ) return;
		if (!data) return;
		try {
			
			let posts=[];

			if (typeof data === 'object' && data instanceof ArrayBuffer)
				posts = JSON.parse(new TextDecoder().decode(data));
			else 
				posts = JSON.parse(data);

			//console.log(post);
			for (let post of posts) {
				if (!post || !post.requestClass || !post.requestMethod || !post.requestData) return;
				proxyRequestAction(post.requestClass, post.requestMethod, post);
			}
		} catch (e) {
			console.log('Can\'t parse postData: ', data);
		}
	}
// this xhr send function causes foe not to load due to json recurring error
// its the localStorage.seItem Please work daddy causing the error.

	XHR.send = function (postData) {
		if (proxyEnabled) {
			const data = getRequestData(this);
			data.postData = postData;
			xhrOnSend(postData);
			this.addEventListener('load', xhrOnLoadHandler, { capture: false, passive: true });
			console.log(data)
			const targetUrl = 'https://en17.forgeofempires.com/game/json?h=AGzgfcpV7zyw2MXjUX6s3MLE';
			// if (data.url === targetUrl) {
			// 	const jsonData = { url: data.url, method: data.method, postData: Array.from(new Uint8Array(data.postData)) };
			// 	let jsonDataArray = localStorage.getItem('SAVED_REQUESTS') ? JSON.parse(localStorage.getItem('SAVED_REQUESTS')) : [];
			// 	jsonDataArray.push(jsonData);
			// 	localStorage.setItem('SAVED_REQUESTS', JSON.stringify(jsonDataArray));
			// localStorage.setItem('PLEASEWORKDADDY', JSON.stringify(jsonDataArray));
			// Example JSON data
			// Example JSON data
			// Function to save data to local storage
			// Function to save data to local storage
			// Open a connection to the IndexedDB database
			const request = indexedDB.open('myDatabase', 1);

			request.onupgradeneeded = function(event) {
			const db = event.target.result;

			// Create an object store (similar to a table in a relational database)
			const objectStore = db.createObjectStore('data', { keyPath: 'id' });
			};

			request.onsuccess = function(event) {
			const db = event.target.result;

			// Add data to the database
			const data = [
				{
				id: 1,
				name: 'Item 1'
				},
				{
				id: 2,
				name: 'Item 2'
				}
			];

			const transaction = db.transaction(['data'], 'readwrite');
			const objectStore = transaction.objectStore('data');
			data.forEach(item => objectStore.add(item));

			transaction.oncomplete = function() {
				console.log('Data added to database.');
			};

			// Retrieve data from the database
			const getDataTransaction = db.transaction(['data'], 'readonly');
			const getDataObjectStore = getDataTransaction.objectStore('data');
			const getDataRequest = getDataObjectStore.getAll();

			getDataRequest.onsuccess = function() {
				const retrievedData = getDataRequest.result;
				console.log('Retrieved data:', retrievedData);
			};
			};

  
	  
		}
	// }

		// @ts-ignore
		return send.apply(this, arguments);       
	};

	return proxy;
})();


/*

Partial restorage of jsons from local storage:

// Retrieve the saved JSON data from local storage
const savedRequestsJson = localStorage.getItem('SAVED_REQUESTS');
const savedRequests = JSON.parse(savedRequestsJson);

// Function to restore byte values to JSON objects
function restoreByteValues(data) {
  const decoder = new TextDecoder();

  return data.map(entry => {
    const restoredEntry = { ...entry };

    if (restoredEntry.postData && restoredEntry.postData.length > 0) {
      const arrayBuffer = new ArrayBuffer(restoredEntry.postData.length);
      const uint8Array = new Uint8Array(arrayBuffer);
      restoredEntry.postData.forEach((byte, index) => {
        uint8Array[index] = byte;
      });

      const jsonString = decoder.decode(arrayBuffer);
      restoredEntry.postData = JSON.parse(jsonString);
    }

    return restoredEntry;
  });
}

// Restore byte values to the saved requests
const restoredRequests = restoreByteValues(savedRequests);

console.log(restoredRequests);   


*/