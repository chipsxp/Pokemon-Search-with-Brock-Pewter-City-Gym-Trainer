import { Dialogs, Utils } from '@nativescript/core';
import { RouteProp } from '@react-navigation/core';
import * as React from "react";
import { StyleSheet } from "react-nativescript";
import { FrameNavigationProp } from "react-nativescript-navigation";
import { MainStackParamList } from "../NavigationParamList";

type ScreenOneProps = {
    route: RouteProp<MainStackParamList, "PokéDex">,
    navigation: FrameNavigationProp<MainStackParamList, "PokéDex">,
};

export function ScreenOne({ navigation }: ScreenOneProps) {
    const [searchQuery, setSearchQuery] = React.useState("");
    const [pokemon, setPokemon] = React.useState(null);
    const [loading, setLoading] = React.useState(false);

    const searchPokemon = async () => {
        if (!searchQuery.trim()) {
            Dialogs.alert("Please enter a Pokemon name");
            return;
        }

        setLoading(true);
        try {
            Utils.dismissSoftInput();
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${searchQuery.toLowerCase()}`);
            const data = await response.json();
            setPokemon(data);
        } catch (error) {
            Dialogs.alert("Pokemon not found!");
        }
        setLoading(false);
    };

    return (
        <scrollView backgroundColor="#2a2a2a" height="100%">
            <flexboxLayout style={styles.container}>
                <image
                    src="https://raw.githubusercontent.com/PokeAPI/media/master/logo/pokeapi_256.png"
                    style={styles.backgroundImage}
                />
                
                <label className="text-3xl mb-6 font-bold text-white">
                    Pokemon Search
                </label>
                
                <textField
                    hint="Enter Pokemon name"
                    text={searchQuery}
                    onTextChange={(args) => setSearchQuery(args.value)}
                    returnKeyType="search"
                    style={styles.searchInput}
                    onReturnPress={searchPokemon}
                />
                
                <button
                    style={styles.searchButton}
                    onTap={searchPokemon}
                    isEnabled={!loading}
                >
                    {loading ? "Searching..." : "Search"}
                </button>

                {pokemon && (
                    <flexboxLayout style={styles.pokemonCard}>
                        <image
                            src={pokemon.sprites.front_default}
                            style={styles.pokemonImage}
                        />
                        
                        <label className="text-2xl font-bold capitalize text-white">
                            {pokemon.name}
                        </label>

                        <label className="text-xl text-white mt-4">Base Stats:</label>
                        {pokemon.stats.map((stat, index) => (
                            <label key={index} className="text-lg text-white ml-2">
                                {stat.stat.name}: {stat.base_stat}
                            </label>
                        ))}

                        <label className="text-xl text-white mt-4">Types:</label>
                        <flexboxLayout style={styles.typeContainer}>
                            {pokemon.types.map((type, index) => (
                                <label
                                    key={index}
                                    className="text-lg text-white mr-2 capitalize"
                                >
                                    {type.type.name}
                                </label>
                            ))}
                        </flexboxLayout>

                        <label className="text-xl text-white mt-4">Other Details:</label>
                        <label className="text-lg text-white">Height: {pokemon.height/10}m</label>
                        <label className="text-lg text-white">Weight: {pokemon.weight/10}kg</label>
                        <label className="text-lg text-white">Base Experience: {pokemon.base_experience}</label>

                        <button
                            style={styles.evolutionButton}
                            onTap={() => navigation.navigate("Evolution Path", { pokemonId: pokemon.id })}
                        >
                            View Evolution Chain
                        </button>
                    </flexboxLayout>
                )}
                
                {!pokemon && (
                    <flexboxLayout style={styles.emptyStateContainer}>
                        <label className="text-xl text-white text-center">
                            "I'm Brock, the Pewter City Gym Leader! Enter a Pokemon name to begin your journey."
                        </label>
                        <image 
                            src="https://archives.bulbagarden.net/media/upload/a/a6/Lets_Go_Pikachu_Eevee_Brock.png" 
                            style={styles.placeholderImage}
                        />
                        <label className="text-lg text-white text-center mt-4">
                            Try searching for Onix or Geodude!
                        </label>
                    </flexboxLayout>
                )}
            </flexboxLayout>
        </scrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flexDirection: "column",
        minHeight: "100%",
    },
    backgroundImage: {
        width: "100%",
        height: 120,
        stretch: "aspectFit",
        horizontalAlignment: "center",
        marginBottom: 20,
    },
    searchInput: {
        fontSize: 22,
        padding: 12,
        marginBottom: 12,
        backgroundColor: "#f0f0f0",
        borderRadius: 10,
        color: "#000000",
    },
    searchButton: {
        fontSize: 22,
        color: "#ffffff",
        backgroundColor: "#2e6ddf",
        padding: 12,
        borderRadius: 10,
        textAlignment: "center",
    },
    pokemonCard: {
        marginTop: 24,
        padding: 20,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        borderRadius: 12,
        flexDirection: "column",
        alignItems: "center",
    },
    pokemonImage: {
        width: 240,
        height: 240,
    },
    typeContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        marginTop: 6,
    },
    evolutionButton: {
        marginTop: 20,
        fontSize: 22,
        color: "#ffffff",
        backgroundColor: "#4CAF50",
        padding: 12,
        borderRadius: 10,
        width: "100%",
        textAlignment: "center",
    },
    emptyStateContainer: {
        marginTop: 40,
        padding: 20,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        borderRadius: 12,
        flexDirection: "column",
        alignItems: "center",
    },
    placeholderImage: {
        width: 250,
        height: 250,
        marginTop: 20,
        stretch: "aspectFit",
    }
});