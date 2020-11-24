import { Point } from "../point";
      /**归一化坐标点 */
      export interface EventDataObject
      {
          /**目标ID */
          Id: string;
          /**目标所在的归一化多边形 */
          Polygon: Point[];
          /**置信度：0-100 */
          Confidence: number;
      } 