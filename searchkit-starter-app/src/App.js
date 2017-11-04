import React, { Component } from 'react'
import extend from 'lodash/extend'
import { SearchkitManager,SearchkitProvider,
  SearchBox, RefinementListFilter, Pagination,
  HierarchicalMenuFilter, HitsStats, SortingSelector, NoHits,
  ResetFilters, RangeFilter, NumericRefinementListFilter,
  ViewSwitcherHits, ViewSwitcherToggle, DynamicRangeFilter,
  InputFilter, GroupedSelectedFilters,
  Layout, TopBar, LayoutBody, LayoutResults,
  ActionBar, ActionBarRow, SideBar, MenuFilter } from 'searchkit'
import './index.css'

const host = "http://134.171.189.13:9200"
const searchkit = new SearchkitManager(host)

function loadDoc(url) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange=function() {
    if (this.readyState == 4 && this.status == 200) {
      console.log(this.responseText)
    }
  };
  xhttp.open("GET", url, true);
  xhttp.send();
}


const MovieHitsGridItem = (props)=> {
  const {bemBlocks, result} = props
  //const { hits } = this.props
  //const hit = hits[0]
  let url = "http://134.171.189.13:9200/" + result._index + "/" + result._type + "/" + result._id
  //loadDoc(url)
  console.log(result)
  const source = extend({}, result._source, result.highlight)
  return (
    //<div className={bemBlocks.item().mix(bemBlocks.container("item"))} data-qa="hit">
    <div style={{width: '100%', boxSizing: 'border-box', padding: 8}}>
    <table className="sk-table sk-table-striped" style={{width: '100%', boxSizing: 'border-box'}}>
    <thead>
    <tr>
    <th>_ID</th>
    </tr>
    </thead>
    <tbody>
          <tr>
            <td> {result._source.envname} </td>
          </tr>
    </tbody>
    </table>
    //  <a href={url} target="_blank">
    //    <img data-qa="poster" alt="presentation" className={bemBlocks.item("poster")} src={result._source.poster} width="170" height="240"/>
    //    <div data-qa="title" className={bemBlocks.item("title")} dangerouslySetInnerHTML={{__html:source.title}}></div>
    //  </a>
    </div>
  )
}

const MovieHitsListItem = (props)=> {
  const {bemBlocks, result} = props
  let url = "http://www.imdb.com/title/" + result._source.imdbId
  const source = extend({}, result._source, result.highlight)
  return (
    <div className={bemBlocks.item().mix(bemBlocks.container("item"))} data-qa="hit">
      <div className={bemBlocks.item("poster")}>
        <img alt="presentation" data-qa="poster" src={result._source.poster}/>
      </div>
      <div className={bemBlocks.item("details")}>
        <a href={url} target="_blank"><h2 className={bemBlocks.item("title")} dangerouslySetInnerHTML={{__html:source.title}}></h2></a>
        <h3 className={bemBlocks.item("subtitle")}>Released in {source.year}, rated {source.imdbRating}/10</h3>
        <div className={bemBlocks.item("text")} dangerouslySetInnerHTML={{__html:source.plot}}></div>
      </div>
    </div>
  )
}

class App extends Component {
  render() {
    return (
      <SearchkitProvider searchkit={searchkit}>
        <Layout>
          <TopBar>
            <div className="my-logo">ESO elasticaserch searchkit</div>
            <SearchBox autofocus={true} searchOnChange={true} queryOptions={{analyzer:"standard"}}/>
          </TopBar>

        <LayoutBody>

          <SideBar>
            <InputFilter id="keyword_input_filter" searchThrottleTime={500} title="keyword" placeholder="keywname" searchOnChange={true} />
            <MenuFilter  field="keywname.keyword" title="keyword" id="keyword_menu_filter"/>
            <RangeFilter field="keywvalue" id="keywvalue_range_filter" min={-1000} max={10000} showHistogram={true} title="keywvalue"/>
          </SideBar>
          <LayoutResults>
            <ActionBar>

              <ActionBarRow>
                <HitsStats translations={{
                  "hitstats.results_found":"{hitCount} results found"
                }}/>
                <ViewSwitcherToggle/>
                <SortingSelector options={[
                  {label:"Relevance", field:"_score", order:"desc"},
                  {label:"Latest Releases", field:"released", order:"desc"},
                  {label:"Earliest Releases", field:"released", order:"asc"}
                ]}/>
              </ActionBarRow>

              <ActionBarRow>
                <GroupedSelectedFilters/>
                <ResetFilters/>
              </ActionBarRow>

            </ActionBar>
            <ViewSwitcherHits
                hitsPerPage={12} highlightFields={["title","plot"]}
                //sourceFilter={["plot", "title", "poster", "imdbId", "imdbRating", "year"]}
                hitComponents={[
                  {key:"grid", title:"Grid", itemComponent:MovieHitsGridItem, defaultOption:true},
                  {key:"list", title:"List", itemComponent:MovieHitsListItem}
                ]}
                scrollTo="body"
            />
            <NoHits suggestionsField={"title"}/>
            <Pagination showNumbers={true}/>
          </LayoutResults>

          </LayoutBody>
        </Layout>
      </SearchkitProvider>
    );
  }
}

export default App;
