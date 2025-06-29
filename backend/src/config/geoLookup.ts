import axios from "axios";

export async function fetchGeoLocation(ip: string) {
  try {
    const response = await axios.get(`https://ipapi.co/${ip}/json/`);
    return {
      city: response.data.city || null,
      region: response.data.region || null,
    };
  } catch {
    return { city: null, region: null };
  }
}
