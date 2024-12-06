import CreateMCQ from "../CreateBookComponents/CreateMCQ";
import CreateFIB from "../CreateBookComponents/CreateFIB";
import Heading from "../CreateBookComponents/CreateHeading";
import Text from "../CreateBookComponents/CreateText";
import Graph from "../CreateBookComponents/CreateGraph";
import Equation from "../CreateBookComponents/CreateEquation";
import Section from "../CreateBookComponents/Section";
import Subsection from "../CreateBookComponents/Subsection";
const renderComponent = (component, handleComponentChange) => {
  switch (component.type) {
    case "Section":
      return (
        <Section
          value={component.content}
          onChange={(content) =>
            handleComponentChange(component.id, content, component.type)
          }
        />
      );
    case "Subsection":
      return (
        <Subsection
          value={component.content}
          onChange={(content) =>
            handleComponentChange(component.id, content, component.type)
          }
        />
      );
    case "Text":
      return (
        <Text
          value={component.content}
          onChange={(content) =>
            handleComponentChange(component.id, content, component.type)
          }
        />
      );
    case "Heading":
      return (
        <Heading
          value={component.content}
          onChange={(content) =>
            handleComponentChange(component.id, content, component.type)
          }
        />
      );
    case "Graph":
      return (
        <Graph
          labels={component.content.labels || []}
          dataPoints={component.content.dataPoints || []}
          onChange={(content) =>
            handleComponentChange(component.id, content, component.type)
          }
        />
      );
    case "Equation":
      return (
        <Equation
          initialEquation={component.content || ""}
          onChange={(content) =>
            handleComponentChange(component.id, content, component.type)
          }
        />
      );
    case "Quiz":
      return (
        <CreateMCQ
          value={component.content}
          onChange={(content) =>
            handleComponentChange(component.id, content, component.type)
          }
        />
      );
    case "FillInTheBlanks":
      console.log(component);
      return (
        <CreateFIB
          value={component.content}
          onChange={(newContent) =>
            handleComponentChange(component.id, newContent, component.type)
          }
        />
      );
    case "Video":
      return (
        <div className="mb-4 p-2 border rounded-lg">
          <input
            type="file"
            className="w-full p-2 border rounded-lg"
            accept="video/*"
            onChange={(e) =>
              handleComponentChange(
                component.id,
                URL.createObjectURL(e.target.files[0])
              )
            }
          />
          {component.content && (
            <video
              controls
              src={component.content}
              className="mt-4 max-h-64 w-full"
            />
          )}
        </div>
      );
    case "Image":
      return (
        <div className="mb-4 p-2 border rounded-lg">
          <input
            type="file"
            className="w-full p-2 border rounded-lg"
            accept="image/*"
            onChange={(e) =>
              handleComponentChange(
                component.id,
                e.target.files[0],
                component.type
              )
            }
          />
          {component.content && (
            <img
              src={component.content}
              alt="Uploaded"
              className="mt-4 max-h-64 w-auto max-w-full object-contain"
            />
          )}
        </div>
      );
    default:
      return null;
  }
};
export default renderComponent;
