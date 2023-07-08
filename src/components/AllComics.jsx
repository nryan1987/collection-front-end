import React, { Component } from 'react';
import Table from 'react-bootstrap/Table';
import Pagination from 'react-bootstrap/Pagination';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import NavigationBar from './NavigationBar';
import { getAllComicsPaginated } from '../services/comicsService';
import Viewcomicmodal from './ViewComicModal';
import { getTokenFromLocalStorage } from '../store/actions/jwtActions';
import { maxMobilePagination } from '../store/constants';
import { mobileCheck } from '../services/Utilities';
import "../css/Components.css"

class AllComics extends Component {
    constructor(props) {
		super(props);

		this.state = { pageList:[], pagination: [], numPages:0, currentPage:0, isLoading:false, searchText:null, pageSize:500, selectedComicId:0, showComicModal: false, isMobile: mobileCheck() };
	}

    componentDidMount() {
        window.addEventListener("resize", this.resize.bind(this));
        this.updateList(this.state.currentPage);
	}

    componentWillUnmount() {
        window.removeEventListener("resize", this.resize.bind(this));
    }

    resize() {
        this.setState({isMobile: mobileCheck()});
    }

    updateList = (pageNumber) => {
        console.log(pageNumber);
        console.log(this.state.searchText);
        this.setState({ isLoading: true });
        // var {jwt} = store.getState().user;
        var localStorage = getTokenFromLocalStorage();
		if(!localStorage) {
			console.log("token expired");
			this.props.history.push("/");
		} else {
            getAllComicsPaginated(localStorage.jwt, pageNumber, this.state.pageSize, this.state.searchText).then(
                (res)=>{
                    console.log(res);
                    if(res.ok) {
                        let page = [];
                        res.comics.map((c)=>{page.push(<tr key={c.comicID} onClick={() => this.handleComicClicked(c.comicID)}>
                            <td>{c.comicID}</td>
                            <td style={{ textAlign:"left" }}>{c.title}</td>
                            <td style={{ width:"5%" }}>{c.volume}</td>
                            <td style={{ width:"5%" }}>{c.issue}</td>
                            <td style={{ textAlign:"right", width:"8%"}}>{c.publicationDate}</td>
                            <td style={{ textAlign:"left" }}>{ c.notes }</td>
                            <td>{c.publisher}</td>
                            <td style={{ width:"5%", textAlign:"right" }}>${c.pricePaid.toFixed(2)}</td>
                            <td style={{ width:"5%", textAlign:"right" }}>${c.value.toFixed(2)}</td>
                            <td>{c.condition}</td>
                        </tr>)});
                        this.setState({pageList: page});
                        this.setState({ isLoading: false });
                        this.setState({ numPages: res.totalPages });
                        this.setState({currentPage: pageNumber+1});
                        this.updatePagination(pageNumber+1);
                        console.log(res.message);
                    }
                    else {
                        alert(res.message);
                        this.setState({ isLoading: false });
                    }
                }
        );
        }
    }

    updatePagination = (activePageNum) => {
        let items = [];
        let numPages = Math.ceil(this.state.numPages);
        let numPagesToDisplay = mobileCheck() ? maxMobilePagination : numPages;

        items.push(<Pagination.First onClick={(e)=>{this.handleOnClickNav(1)}}/>);
        items.push(<Pagination.Prev onClick={(e)=>{this.handleOnClickNav(this.state.currentPage - 1)}}/>);

        let startNum = 0;
        let endNum = 0;

        for(let number = 0; number < Math.ceil(numPages/numPagesToDisplay); number++) {
            startNum = 1 + (numPagesToDisplay*number);
            endNum = numPagesToDisplay + (numPagesToDisplay*number);

            if(activePageNum <= endNum && activePageNum >= startNum) {
                break;
            }
        }

        if(startNum > 1) {
            items.push(<Pagination.Ellipsis onClick={(e)=>{this.handleOnClickNav(startNum - numPagesToDisplay)}}/>);
        }

        for(let number = startNum; number <= endNum && number <= numPages; number++) {
            items.push(
                <Pagination.Item key={number} active={number === activePageNum} onClick={(e)=>{this.handleOnClickNav(number)}}>
                    {number}
                </Pagination.Item>
            );
        }

        if(endNum < numPages) {
            items.push(<Pagination.Ellipsis onClick={(e)=>{this.handleOnClickNav(endNum + 1)}}/>);
        }

        items.push(<Pagination.Next onClick={(e)=>{this.handleOnClickNav(this.state.currentPage + 1)}}/>);
        items.push(<Pagination.Last onClick={(e)=>{this.handleOnClickNav(this.state.numPages)}}/>);
        this.setState({pagination: items});
    }

    handleOnClickNav = (pageNum) => {
        if(pageNum > 0 && pageNum <= this.state.numPages && pageNum !== this.state.currentPage) {
            this.setState({currentPage: pageNum});
            this.updatePagination(pageNum);
            this.updateList(pageNum - 1);
        }
    }
    
    handleSearchClick = () => {
        console.log(this.state.searchText);
        this.updateList(0);
    }

    handleComicClicked = (comicID) => {
        console.log("ComicID: " + comicID);
        this.setState({selectedComicId: comicID});
        this.setState({showComicModal: true});
    }

    hideComicModal = () => {
        console.log("Updating showComicModal");
        this.setState({showComicModal: false});
    }

    render() {
        var results;
        if(this.state.pageList.length > 0) {
            results = <Table size="sm" striped bordered hover hidden={this.state.isLoading}>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Volume</th>
                    <th>Issue</th>
                    <th>Publication Date</th>
                    <th>Notes</th>
                    <th>Publisher</th>
                    <th>Price Paid</th>
                    <th>Value</th>
                    <th>Condition</th>
                </tr>
            </thead>
            <tbody>
                {this.state.pageList}
            </tbody>
        </Table>;
        } else {
            results = <div>No Items match your search</div>
        }


        return (
            <div>
                <NavigationBar history={this.props.history}/>
                <InputGroup className="mb-3">
                    <FormControl
                        placeholder="Search"
                        aria-describedby="basic-addon2"
                        onChange={(e)=>{this.setState({searchText: e.target.value})}}
                    />
                    <Button variant="outline-secondary" id="button-addon2" onClick={this.handleSearchClick}>
                        Search
                    </Button>
                </InputGroup>
                <Pagination size="sm" classname="pagination">{this.state.pagination}</Pagination>
                <Spinner animation="border" role="status" hidden={!this.state.isLoading}>
                    {/* <span className="visually-hidden">Loading...</span> */}
                </Spinner>
                {!this.state.isLoading && results}
                <Pagination size="sm" classname="pagination">{this.state.pagination}</Pagination>
                { this.state.showComicModal ? 
                    <Viewcomicmodal showModal={this.state.showComicModal} comicID={this.state.selectedComicId} onHide={this.hideComicModal}/>
                    : 
                    null 
                }
            </div>
        );
    }
}

export default AllComics;
