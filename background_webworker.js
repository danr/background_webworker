
function background(f) {
  const blob = new Blob([`
    const f = ${f.toString()}
    onmessage = e => postMessage({id: e.data.id, message: f(e.data.payload)})
  `])
  const worker = new Worker(URL.createObjectURL(blob))
  let id = 0
  const cbs = {}
  worker.onmessage = e => {
    const {id, message} = e.data
    const cb = cbs[id]
    delete cbs[id]
    // console.log({id}, Object.keys(cbs).length)
    cb(message)
  }
  const ret = (payload, cb) => {
    cbs[id] = cb
    worker.postMessage({id, payload})
    ++id
  }
  ret.terminate = () => worker.terminate()
  return ret
}

const bg = background(d => d[0] * d[1])

for (let i = 0; i < 1000; ++i) {
  bg([i, 1], x => console.log(x))
}

