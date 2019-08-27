import React, { Component } from 'react';
import { Input, Button, Card, Grid, Table, Image } from 'semantic-ui-react';
import api from '../../services/api';

import researchIcon from '../../icons/reload.svg';
import removeIcon from '../../icons/remove.svg';

import './styles.css';

export default class Main extends Component {
    state = {
        items: []
    }

    //Warning Box
    useWarningBox(open, text = ""){
        if(open === true){
            document.getElementById('alert-text').textContent = text;
            document.getElementById('alert-tab').style.display = "block";
        }else{
            document.getElementById('alert-tab').style.display = "none";
        }
    }

    //API Connect
    getData = async (name = "") =>{
        if(name.length === 0){
            name = document.getElementById('name').value;
        }

        try {
            const response = await api.get(`/${name}`);  

            let data = response.data;

            const fullName =  data.full_name;
            let nameAndComp = fullName.split('/');
            data.full_name = nameAndComp;

            return data;
        } catch(exception) {
            return this.useWarningBox(true, "Repositório inexistente.");
        }
    }

    //Cards
    addCard = async () =>{
        try {
            this.useWarningBox(true, "Carregando...");

            const { items } = this.state;
            let data = await this.getData().then(result => result);

            // Verifica se já foi adicionado
            let isEqual = false;
            
            items.map(value => {
                if(value.html_url === data.html_url){
                    isEqual = true;
                }
            });

            if(isEqual){
                return this.useWarningBox(true, "Informação já foi adicionada.");
            }

            // Adiciona
            items.push(data);

            this.setState({ 
                items: items
            });

            this.useWarningBox(false);
        } catch(exception) {
            return this.useWarningBox(true, "Repositório inexistente.");
        }
    }

    removeCard = async (id) =>{
        const { items } = this.state;
        items.splice(id, 1);

        this.setState({ 
            items: items
        });
    }

    researchCard = async (id, name) =>{
        this.useWarningBox(true, "Carregando...");

        const { items } = this.state;
        let data = await this.getData(name).then(result => result);

        items[id] = data;

        this.setState({ 
            items: items
        });

        this.useWarningBox(false);
    }

    render() {
        const { items } = this.state;

        return (
            <div className="item-list"> 
                <div id="Search">
                    <Card>
                        <Card.Content>
                            <Card.Meta>
                                <div id="alert-tab">
                                    <span className="closebtn" onClick={() => this.useWarningBox(false)}>&times;</span>  
                                    <span id="alert-text"></span>
                                </div>

                                <Image src='https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png' size='tiny' verticalAlign='middle'/>
                                <span id="card-header-title" color='violet'>Repositórios {items.length}</span>
                            </Card.Meta>

                            <Card.Description>
                                <Input type="text" id="name" name="name" placeholder="items/react"/>
                                <Button color='violet' onClick={this.addCard}>ADD</Button>
                            </Card.Description>
                        </Card.Content>
                    </Card>
                </div>

                <div id="ContentBox">
                    <Grid>
                        <Grid.Row columns={4}>
                            {items.map((value, index) => (
                                <Grid.Column id={`card${index}`}>
                                    <Card centered>
                                        <Card.Content>
                                            <Card.Meta>
                                                <Card.Header>
                                                    <Image src={value.organization.avatar_url} size='tiny' verticalAlign='middle' centered circular/>

                                                    <h1>
                                                        {value.full_name[1]}
                                                        <br />
                                                        <div className="unTitled">{value.full_name[0]}</div>
                                                    </h1>
                                                </Card.Header>
                                            </Card.Meta>

                                            <Table singleLine striped>
                                                <Table.Body>
                                                    <Table.Row>
                                                        <Table.Cell collapsing>
                                                            starts
                                                        </Table.Cell>
                                                        <Table.Cell collapsing textAlign='right'>{value.stargazers_count}</Table.Cell>
                                                    </Table.Row>

                                                    <Table.Row>
                                                        <Table.Cell collapsing>
                                                            language
                                                        </Table.Cell>
                                                        <Table.Cell collapsing textAlign='right'>{value.language}</Table.Cell>
                                                    </Table.Row>

                                                    <Table.Row>
                                                        <Table.Cell collapsing>
                                                            forks
                                                        </Table.Cell>
                                                        <Table.Cell collapsing textAlign='right'>{value.forks_count}</Table.Cell>
                                                    </Table.Row>
                                                </Table.Body>
                                            </Table>

                                            <div id="icons">
                                                <Grid.Row columns={1}>
                                                    <Grid.Column>
                                                        <Image src={removeIcon} className="remove-icon" onClick={() => this.removeCard(index)} />
                                                        <Image src={researchIcon} className="research-icon" onClick={() => this.researchCard(index, `${value.full_name[0]}/${value.full_name[1]}`)} />
                                                    </Grid.Column>
                                                </Grid.Row>
                                            </div>
                                        </Card.Content>
                                    </Card>
                                </Grid.Column>
                            ))}
                        </Grid.Row>
                    </Grid> 
                </div>
            </div>
        )
    }
}