// example typed query key factory usage

/*
const todoKeys = {
  // ✅ all keys are arrays with exactly one object
  all: [{scope: 'todos'}] as const,
  lists: () => [{...todoKeys.all[0], entity: 'list'}] as const,
  list: (state: State, sorting: Sorting) =>
    [{...todoKeys.lists()[0], state, sorting}] as const,
};

const fetchTodos = async ({
  // ✅ extract named properties from the queryKey
  queryKey: [{ state, sorting }],
}: QueryFunctionContext<ReturnType<typeof todoKeys['list']>>) => {
  const response = await axios.get(`todos/${state}?sorting=${sorting}`)
  return response.data
}

export const useTodos = () => {
  const { state, sorting } = useTodoParams()

  return useQuery({
    queryKey: todoKeys.list(state, sorting),
    queryFn: fetchTodos
  })
}

*/
