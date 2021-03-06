import React, {Component} from 'react';
import {Api} from "@services/api";
import {AdminContainer, Button, Field, PageContainer} from "@components/admin/adminContainer";
import {AdminProjects} from "@components/admin/adminProjects";
import {CollectionSchema, DocumentSchema} from "@apiTypes/apiSchema";

interface AdminProps {
    api: Api,
    all: {
        page: string,
        projects: CollectionSchema[],
        docs: DocumentSchema[]
    }[]
}

interface AdminState {
    all: {
        page: string,
        projects: CollectionSchema[],
        docs: DocumentSchema[]
    }[]
    login: {
        user: string,
        password: string
    },
    authorization: string,
}

export default class extends Component<AdminProps, AdminState> {
    public static title: string = "admin";
    props: AdminProps;
    private api: Api;
    private pages: string[] = ["villas", "immeubles", "urbanisme"];

    public static getInitialProps = async (context) => {

        const api = new Api();
        await api.getInitialToken(context);
        const pages = ["villas", "immeubles", "urbanisme"];
        const all: any[] = [];
        for (const dbName of pages) {
            try {
                const response = await api.getAllCollections(dbName)
                const ids = response.collections.map((col) => col.name)
                const projects = await Promise.all(ids.map(async (id) => await api.getMetadata(dbName, id)))
                const docs = await Promise.all(projects.map(async (project) => {
                    return await api.getAllDocuments(dbName, project.collection);
                }));
                all.push({
                    page: dbName,
                    projects,
                    docs
                })
            } catch (err) {
            }
        }
        console.log(all)
        api.removeCtx();
        return {api, all};
    };

    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            all: this.props.all,
            login: {
                user: "",
                password: ""
            },
            authorization: null
        }
    };

    componentDidMount() {
        this.api = new Api();
    }

    private update = async (dbName: string) => {
        const all = this.state.all
        const response = await this.api.getAllCollections(dbName)
        const ids = response.collections.map((col) => col.name)
        const projects = await Promise.all(ids.map(async (id) => await this.api.getMetadata(dbName, id)))
        const docs = await Promise.all(projects.map(async (project) => {
            return await this.api.getAllDocuments(dbName, project.collection);
        }));
        all.splice(all.findIndex(e => e.page == dbName), 1, {page: dbName, projects, docs})
        this.setState({all})
    };

    private updateUser = async (e) => {
        await this.setState({login: {...this.state.login, user: e.target.value}});
    };

    private updatePassword = async (e) => {
        await this.setState({login: {...this.state.login, password: e.target.value}});
    };

    private auth = async () => {
        const authorization = await this.api.login(this.state.login);
        this.setState({authorization})
    };

    render() {
        return (<>
            <AdminContainer>
                <PageContainer style={{display: this.state.authorization ? "none" : "inline-block"}}>
                    &emsp;User &emsp; &emsp;&emsp;<Field onChange={this.updateUser} value={this.state.login.user}/><br/>
                    &emsp;Password&emsp;<Field onChange={this.updatePassword} value={this.state.login.password}
                                               type="password"/><br/>
                    <Button onClick={this.auth}>LOGIN</Button>
                </PageContainer>

                {this.state.all ? this.pages.map((page, index) =>
                    <PageContainer style={{display: this.state.authorization ? "block" : "none"}}>
                        <AdminProjects key={index} index={index} page={page}
                                       projects={this.state.all.find(e => e.page == page).projects}
                                       docs={this.state.all.find(e => e.page == page).docs}
                                       updateParent={async () => await this.update(page)}/>
                    </PageContainer>
                ) : <></>}
            </AdminContainer>
        </>)
    }
}