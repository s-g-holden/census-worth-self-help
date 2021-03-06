import React from "react"
import renderer from "react-test-renderer"
import Search from "../search"
import SearchHistory from "../../utils/searchhistory"
import { render, fireEvent } from "react-testing-library"
import { articleList, articleNode, siteSearchIndex } from "../../utils/testdata"
import ReactDOMServer from "react-dom/server"
import { Index } from "elasticlunr"
import QuerySanitizer from "../../utils/querysanitizer"

const mockSanitizer = jest.fn(query => query)

jest.mock("../../utils/querysanitizer", () => {
  return jest.fn().mockImplementation(() => {
    return { sanitize: mockSanitizer }
  })
})

const mockStore = jest.fn(value => {})
const mockRetrieve = jest.fn(callback => {})

jest.mock("../../utils/searchhistory", () => {
  return jest.fn().mockImplementation(() => {
    return {
      store: mockStore,
      retrieve: mockRetrieve
    }
  })
})

describe("Search", () => {
  let data

  beforeEach(() => {
    window._paq = []
    jest.clearAllMocks()

    const index = new Index()
    const indexVals = ["title", "roles", "tags", "description", "body"]

    indexVals.forEach(name => index.addField(name))

    data = {
      allMarkdownRemark: articleList,
      siteSearchIndex: { index: index.toJSON() }
    }
  })

  it("renders correctly", () => {
    const data = { allMarkdownRemark: articleList }
    const tree = renderer.create(<Search data={data} />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it("anlytics captured", () => {
    const { getByTestId } = render(<Search data={data} debounceDelay={0} />)
    const searchBox = getByTestId("search-box")
    fireEvent.change(searchBox, { target: { value: "TEST QUERY" } })
    // check paq updated.
    expect(window._paq[0]).toEqual(["setCustomDimension", 1, "other"])
    expect(window._paq[1]).toEqual([
      "trackEvent",
      "search",
      "query",
      "TEST QUERY",
      ""
    ])
    expect(window._paq[2]).toEqual(["trackSiteSearch", "TEST QUERY", false, 0])
  })

  it("bold-pattern function works correctly", () => {
    expect(
      ReactDOMServer.renderToStaticMarkup(
        Search.replacePatternToBold(
          "we are bolding test",
          new RegExp("(test)", "ig")
        )
      )
    ).toEqual("we are bolding <strong>test</strong>")

    expect(
      ReactDOMServer.renderToStaticMarkup(
        Search.replacePatternToBold(
          "we are bolding test and best",
          new RegExp("(test|best)", "ig")
        )
      )
    ).toEqual("we are bolding <strong>test</strong> and <strong>best</strong>")

    expect(
      ReactDOMServer.renderToStaticMarkup(
        Search.replacePatternToBold(
          "we are bolding nothing",
          new RegExp("(something)", "ig")
        )
      )
    ).toEqual("we are bolding nothing")

    expect(
      ReactDOMServer.renderToStaticMarkup(
        Search.replacePatternToBold(
          "we are bolding just this",
          new RegExp("(just this|notthis)", "ig")
        )
      )
    ).toEqual("we are bolding <strong>just this</strong>")
  })

  it("tag stripping", () => {
    expect(Search.stripHTML("<p><br />hi<br /> <h1>hello</h1>")).toEqual(
      "hi hello"
    )
  })

  it("highlight function on node works correctly", () => {
    let node = articleNode
    node.frontmatter.tags = ["a", "b", "hello", "d"]
    node.frontmatter.description = "this is my beautiful description"

    // search description
    Search.highlightNode(node, "beautiful")
    expect(ReactDOMServer.renderToStaticMarkup(node.highlightedText)).toEqual(
      "this is my <strong>beautiful</strong> description"
    )

    // search tags
    Search.highlightNode(node, "hello")
    expect(ReactDOMServer.renderToStaticMarkup(node.highlightedText)).toEqual(
      "a, b, <strong>hello</strong>, d"
    )

    // search capitalisied tags
    Search.highlightNode(node, "HELLO")
    expect(ReactDOMServer.renderToStaticMarkup(node.highlightedText)).toEqual(
      "a, b, <strong>hello</strong>, d"
    )

    // search missing, default to description
    Search.highlightNode(node, "Waldo")
    expect(ReactDOMServer.renderToStaticMarkup(node.highlightedText)).toEqual(
      "this is my beautiful description"
    )

    // search two words in description
    Search.highlightNode(node, "description beautiful")
    expect(ReactDOMServer.renderToStaticMarkup(node.highlightedText)).toEqual(
      "this is my <strong>beautiful</strong> <strong>description</strong>"
    )
  })

  it("the query sanitizer is called with the query when updateSearchResultsCallback is called", () => {
    const evt = { target: { value: "abc" } }

    expect(mockSanitizer.mock.calls.length).toEqual(0)
    const search = renderer.create(<Search data={data} debounceDelay={0} />)
    search.getInstance().updateSearchResultsCallback(evt)

    expect(mockSanitizer.mock.calls.length).toEqual(1)
    const sanitizerArguments = mockSanitizer.mock.calls[0]
    expect(sanitizerArguments[0]).toEqual("abc")
  })

  it("stores the query on search bar update", async () => {
    const query = "i am a test query"

    const primarySearch = renderer.create(
      <Search data={data} debounceDelay={0} />
    )
    primarySearch.getInstance().addTermToSearchHistory(query)
    expect(mockStore).toHaveBeenCalledWith(query)
  })

  it("when search is instantiated then retrieve is called", async () => {
    expect(mockRetrieve).not.toHaveBeenCalled()

    const search = renderer.create(<Search data={data} debounceDelay={0} />)

    expect(mockRetrieve).toHaveBeenCalled()
  })
})
