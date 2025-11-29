
import * as path from 'path';
import { MAP_ROTATIONS } from '../config/mapRotation';
import { MapRotation } from '../types';
import { logger } from './logger';
import { HtmlRenderer } from './htmlRenderer';

const renderer = new HtmlRenderer();

let cachedImage: Buffer | null = null;
let cachedHour: number | null = null;

export async function generateMapImage(currentRotation: MapRotation): Promise<Buffer> {
  // Return cached image if available for the current rotation hour
  if (cachedImage && cachedHour === currentRotation.hour) {
    return cachedImage;
  }

  try {
    const forecast: MapRotation[] = [];
    const currentHour = currentRotation.hour;
    for (let i = 1; i <= 6; i++) {
      const hourIndex = (currentHour + i) % 24;
      forecast.push(MAP_ROTATIONS[hourIndex]);
    }

    const buffer = await renderer.render({
      current: currentRotation,
      forecast: forecast,
    });

    // Update cache
    cachedImage = buffer;
    cachedHour = currentRotation.hour;

    return buffer;
  } catch (error) {
    logger.error({ err: error }, 'Error generating map image');
    throw error;
  }
}
