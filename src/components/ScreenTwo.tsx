import { RouteProp } from '@react-navigation/core';
import * as React from "react";
import { StyleSheet } from "react-nativescript";
import { FrameNavigationProp } from "react-nativescript-navigation";
import { MainStackParamList } from "../NavigationParamList";

type ScreenTwoProps = {
    route: RouteProp<MainStackParamList, "Evolution Path">,
    navigation: FrameNavigationProp<MainStackParamList, "Evolution Path">,
};

export function ScreenTwo({ navigation, route }: ScreenTwoProps) {
    const [evolutionChain, setEvolutionChain] = React.useState(null);
    const [pokemonImages, setPokemonImages] = React.useState({});
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        fetchEvolutionChain();
    }, []);

    const fetchPokemonImage = async (name) => {
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
            const data = await response.json();
            return data.sprites.front_default;
        } catch (error) {
            console.error(`Error fetching image for ${name}:`, error);
            return null;
        }
    };

    const fetchEvolutionChain = async () => {
        try {
            const speciesResponse = await fetch(
                `https://pokeapi.co/api/v2/pokemon-species/${route.params.pokemonId}`
            );
            const speciesData = await speciesResponse.json();

            const evolutionResponse = await fetch(speciesData.evolution_chain.url);
            const evolutionData = await evolutionResponse.json();

            const evolutions = getEvolutionDetails(evolutionData.chain);
            const images = {};
            
            for (const evolution of evolutions) {
                images[evolution.name] = await fetchPokemonImage(evolution.name);
            }
            
            setPokemonImages(images);
            setEvolutionChain(evolutionData);
        } catch (error) {
            console.error("Error fetching evolution chain:", error);
        }
        setLoading(false);
    };

    const getEvolutionDetails = (chain) => {
        const evolutions = [];
        let current = chain;

        while (current) {
            evolutions.push({
                name: current.species.name,
                min_level: current.evolution_details[0]?.min_level || null,
            });
            current = current.evolves_to[0];
        }

        return evolutions;
    };

    return (
        <flexboxLayout style={styles.container}>
            <image
                src="https://raw.githubusercontent.com/PokeAPI/media/master/logo/pokeapi_256.png"
                style={styles.backgroundImage}
            />
            
            <label className="text-3xl mb-6 font-bold text-white">Evolution Chain</label>

            {loading ? (
                <activityIndicator busy={true} color="#ffffff" />
            ) : evolutionChain ? (
                <flexboxLayout style={styles.evolutionList}>
                    {getEvolutionDetails(evolutionChain.chain).map((evolution, index, array) => (
                        <flexboxLayout key={index} style={styles.evolutionItem}>
                            <image
                                src={pokemonImages[evolution.name]}
                                style={styles.pokemonImage}
                            />
                            <label className="text-xl capitalize text-white">{evolution.name}</label>
                            {evolution.min_level && (
                                <label className="text-lg text-white">
                                    Level {evolution.min_level}
                                </label>
                            )}
                            {index < array.length - 1 && (
                                <label className="text-2xl text-white mt-2 mb-2">↓</label>
                            )}
                        </flexboxLayout>
                    ))}
                </flexboxLayout>
            ) : (
                <label className="text-xl text-white">No evolution data available</label>
            )}

            <button
                style={styles.backButton}
                onTap={() => navigation.goBack()}
            >
                Go Back
            </button>
        </flexboxLayout>
    );
}

const styles = StyleSheet.create({
    container: {
        height: "100%",
        padding: 20,
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "#2a2a2a",
    },
    backgroundImage: {
        width: "100%",
        height: 120,
        stretch: "aspectFit",
        horizontalAlignment: "center",
        marginBottom: 20,
    },
    evolutionList: {
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        padding: 20,
        borderRadius: 12,
        width: "100%",
    },
    evolutionItem: {
        flexDirection: "column",
        alignItems: "center",
        marginVertical: 12,
    },
    pokemonImage: {
        width: 240,
        height: 240,
    },
    backButton: {
        marginTop: 24,
        fontSize: 22,
        color: "#ffffff",
        backgroundColor: "#2e6ddf",
        padding: 12,
        borderRadius: 10,
    },
});