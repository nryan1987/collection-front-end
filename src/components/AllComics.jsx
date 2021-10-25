import React, { Component } from 'react';
import store from "../store/Store";
import Table from 'react-bootstrap/Table';
import Pagination from 'react-bootstrap/Pagination';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import NavigationBar from './NavigationBar';
import { getAllComicsPaginated, getCollectionStats } from '../services/comicsService';

class AllComics extends Component {
    constructor(props) {
		super(props);

		this.state = { pageList:[], pagination: [], numPages:0, isLoading:false, searchText:null, pageSize:500 };
	}

    componentDidMount() {
        this.updateList(0);

        /*var {jwt} = store.getState().user;
        getCollectionStats(jwt).then(
			(stats)=>{
                console.log("Stats: ", stats);
				this.setState({ countOfComics: stats.countOfComics });
                this.updatePagination(1);
			}
		);*/
	}

    updateList = (pageNumber) => {
        console.log(pageNumber);
        console.log(this.state.searchText);
        this.setState({ isLoading: true });
        var {jwt} = store.getState().user;
        getAllComicsPaginated(jwt, pageNumber, this.state.pageSize, this.state.searchText).then(
                (res)=>{
                    console.log(res);
                    if(res.ok) {
                        let page = [];
                        res.value.map((c)=>{page.push(<tr key={c.comicID}>
                            <td>{c.comicID}</td>
                            <td style={{ textAlign:"left" }}>{c.title}</td>
                            <td style={{ width:"5%" }}>{c.volume}</td>
                            <td style={{ width:"5%" }}>{c.issue}</td>
                            <td>{c.publicationDate}</td>
                            <td>{c.notes}</td>
                            <td>{c.publisher}</td>
                            <td style={{ textAlign:"right" }}>${c.pricePaid.toFixed(2)}</td>
                            <td style={{ textAlign:"right" }}>${c.value.toFixed(2)}</td>
                            <td>{c.condition}</td>
                        </tr>)});
                        this.setState({pageList: page});
                        this.setState({ isLoading: false });
                        this.setState({ numPages: res.totalPages });
                        this.updatePagination(pageNumber+1);
                        console.log(res.message);
                    }
                    else {
                        alert(res.message);
                    }
                }
        );
    }

    updatePagination = (activePageNum) => {
        let items = [];
        let numPages = Math.ceil(this.state.numPages);
        for (let number = 1; number <= numPages; number++) {
            items.push(
                <Pagination.Item key={number} active={number === activePageNum} onClick={(e)=>{this.handleOnClick(e)}}>
                    {number}
                </Pagination.Item>,
            );
        }
        this.setState({pagination: items});
    }

    handleOnClick = (e) => {
        console.log(e.target.text);
        this.updatePagination(parseInt(e.target.text));
        this.updateList(parseInt(e.target.text) - 1);
    }
    
    handleSearchClick = () => {
        console.log(this.state.searchText);
        this.updateList(0);
    }

    render() {
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
                <Pagination size="sm" style={{ display: "flex", justifyContent: "center" }}>{this.state.pagination}</Pagination>
                <Spinner animation="border" role="status" hidden={!this.state.isLoading}>
                    {/* <span className="visually-hidden">Loading...</span> */}
                </Spinner>
                <Table size="sm" striped bordered hover hidden={this.state.isLoading}>
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
                </Table>
                <Pagination size="sm" style={{ display: "flex", justifyContent: "center" }}>{this.state.pagination}</Pagination>
            </div>
        );
    }
}

export default AllComics;
