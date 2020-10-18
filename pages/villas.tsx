import React, {Component} from 'react';
import {Api} from "@services/api";
import {CollectionSchema} from "@apiTypes/apiSchema";
import {ProjectGrid} from "@components/global/projectGrid";

interface IndexProps {
    api: Api,
    projects: CollectionSchema[],
}

interface IndexState {
    dbName: string,
    api: Api,
    projects: CollectionSchema[],
}

export default class extends Component<IndexProps, IndexState> {
    public static title: string = "villas";
    props: IndexProps;

    public static getInitialProps = async (context) => {
        try {
            const api = new Api();  //NextJS api
            await api.getInitialToken(context);
            const response = await api.getAllCollections("villas")
            const ids = response.collections.map((col) => col.name)
            const projects = await Promise.all(ids.map(async (id) => await api.getMetadata("villas", id)))
            api.removeCtx();
            return {api, projects};
        } catch (err) {
            return {};
        }
    };

    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            dbName: "villas",
            projects: this.props.projects,
            api: this.props.api,
        }
    };

    render() {
        return ProjectGrid({dbName: this.state.dbName, elements: this.state.projects});
    }

}