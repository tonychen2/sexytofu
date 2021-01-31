import React, { Component } from 'react';

const API_ADDRESS = 'https://api.ghgi.org';

class App extends Component {
    state = {foodQuery:'', food: null};

    updatefoodQuery = event => {
        console.log('event.target.value', event.target.value);
        this.setState({foodQuery: event.target.value});
    }

    handleKeyPress = event =>{
        if (event.key === 'Enter') {
            this.searchFood();
            // const data = JSON.stringify({'recipe': [this.state.foodQuery]});
            
            }
        }

    searchFood = () => {
        console.log('this.state', this.state.foodQuery);

        const data = '{"recipe" : ["100 g beef"]}';
            console.log(data);

            fetch(`${API_ADDRESS}/rateCarbon`, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: data})
            .then(response => response.json())
            .then(json => console.log('json', json));
            

           // if (json().impact > 0 ){
           //   const food = json().impact.items[0];

           //   console.log('food', food);
           //   this.setState({ food});
  // }
}

    render(){
        return(
            <div> 
                <h2>Sexy Tofu</h2>
                <input 
                onChange={this.updatefoodQuery}
                onKeyPress={this.handleKeyPress}
                placeholder='Find your food'
                />
                <button onClick={this.searchFood}>Search</button>
            </div>
        );
    }
}
export default App;