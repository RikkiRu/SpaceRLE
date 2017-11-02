class JsonSaveData
{
    fractions: JsonFractionData[];
    planets: JsonPlanetData[];
    playerFraction: number;
    mapRect: JsonRect;
}

class JsonPlanetData
{
    id: number;
    ownerID: number;
    radius: number;
    position: JsonVector2;
}

class JsonFractionData
{
    id: number;
    color: JsonColor;
    fleet: JsonFleetRow[];
}

class JsonFleetRow
{
    shipName: string;
    count: number;
}