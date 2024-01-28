import { useState } from 'react'

import { useCreateResource, useFetchResources, useDeleteResource } from './data/myFakeResource'

function App() {

  const [content, setContent] = useState("")

  const {
    isLoading,
    data
  } = useFetchResources()

  const {
    mutateAsync,
    isLoading: isCreating,
  } = useCreateResource()

  const {
    mutateAsync: deleteAsync,
    isLoading: isDeleting
  } = useDeleteResource()

  return (
    <>
      <h2>hello</h2>
      <div>
        {isLoading && (<h2>is fetchin data....</h2>)}
        {!isLoading && !!data?.length && data?.map((el) => (
          <div key={el.id}>
            {el.id} - {el.content} &nbsp;
            <button
              onClick={() => {
                deleteAsync(el.id)
              }}
            >
              Delete
            </button>
          </div>
        ))}
        {!isLoading && !data?.length && (
          <div>list is empty</div>
        )}
        <br />
        <input value={content} onChange={(e) => {
          setContent(e.target.value)
        }} />
        <button
          onClick={async () => {
            await mutateAsync({
              content,
            })
            setContent("")
          }}
        >
          {isCreating ? "is creating..." : "create element"}
        </button>
      </div>
    </>
  )
}

export default App
