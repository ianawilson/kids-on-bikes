import React from "react";

export type SearchResult = {
  key: number;
  value: string;
}
export type SearchFunc = (query: string, showAll?: boolean) => Array<SearchResult>
export type SearchSelectCallback = (key: number) => void

function Result({ result, selectCallback }: {result: SearchResult, selectCallback: () => void}) {
  return (
    <div className="p-2 bg-gray-100 w-40 underline text-blue-600 hover:text-blue-400 hover:bg-gray-200 cursor-pointer" onClick={selectCallback}>
      <span className="">{result.value}</span>
    </div>
  )
}

export function Search({ description, placeholder, searchFunc, selectCallback, className }: { description: string, placeholder?: string, searchFunc: SearchFunc, selectCallback: SearchSelectCallback, className?: string }) {
  const [query, setQuery] = React.useState('')
  const [results, setResults] = React.useState<Array<SearchResult>>([])

  const runQuery = (q: string, showAll = false) => {
    setQuery(q)
    if (showAll) {
      setResults(searchFunc('', showAll))
    } else if (q.length > 0) {
      setResults(searchFunc(q))
    } else {
      setResults([])
    }
  }

  const runSelectCallback = (key: number) => {
    runQuery('')
    selectCallback(key)
  }

  return (
    <div className={className}>
      <div className="flex">
        <div className="pr-2">{description}</div>
        <div>
          <input className="px-1 font-normal" placeholder={placeholder} value={query} onChange={(e) => runQuery(e.target.value)} />
          <div className="absolute drop-shadow">
            {results.map((r) => (
              <Result key={r.key} result={r} selectCallback={() => {runSelectCallback(r.key)}} />
            ))}
          </div>
        </div>
        <div className="px-1 bg-blue-400 text-gray-100 rounded-r hover:bg-blue-500 cursor-pointer" onClick={() => runQuery('', true)}>Show all</div>
      </div>
    </div>
  )
}

type Queryable = {
  key?: number;
  value?: string;
}

export class SearchHelper<Type> {
  private array: Array<Type>;
  private toQueryable: (obj: Type) => Queryable;
  private toResult: (obj: Type) => SearchResult;

  constructor(array: Array<Type>, toQueryable: (obj: Type) => Queryable, toResult: (obj: Type) => SearchResult) {
    this.array = array
    this.toQueryable = toQueryable
    this.toResult = toResult
  }

  search(query: string, showAll = false): Array<SearchResult> {
    let filtered = this.array
      .filter((obj) => this.toQueryable(obj).key !== undefined)
    if (!showAll) {
      filtered = filtered
        .filter((obj) => this.toQueryable(obj).value?.toLowerCase().includes(query.toLowerCase()))
    }
    return filtered
      .map(this.toResult)
  }
}

export function searchArray<Type>(array: Array<Type>, query: string, showAll = false): Array<SearchResult> {

}