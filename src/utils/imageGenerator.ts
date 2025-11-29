
import * as path from 'path';
import { MAP_ROTATIONS } from '../config/mapRotation';
import { MapRotation } from '../types';
import { logger } from './logger';
import { HtmlRenderer } from './htmlRenderer';

const renderer = new HtmlRenderer();

export async function generateMapImage(currentRotation: MapRotation): Promise<Buffer> {
  try {
    const forecast: MapRotation[] = [];
    const currentHour = currentRotation.hour;
    for (let i = 1; i <= 6; i++) {
      const hourIndex = (currentHour + i) % 24;
      forecast.push(MAP_ROTATIONS[hourIndex]);
    }

    return await renderer.render({
      current: currentRotation,
      forecast: forecast,
    });
  } catch (error) {
    logger.error({ err: error }, 'Error generating map image');
    throw error;
  }
}
