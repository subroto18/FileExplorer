import { useState } from "react";
import "./App.css";
import { MdDeleteOutline } from "react-icons/md";
import { AiFillFolderAdd } from "react-icons/ai";

import json from "./api.json";

type FolderStructure = {
  id: number;
  name: string;
  isFolder: boolean;
  children: FolderStructure[];
};

type Props = {
  data: FolderStructure;
  insertNewFolder: (id: number) => number;
  deleteFolder: (id: number) => number;
};

type ToggleState = {
  [key: number]: boolean;
};

function ListData({ data, insertNewFolder, deleteFolder }: Props) {
  const { id, name, isFolder, children } = data;

  const [toggle, setToggle] = useState<ToggleState>({});

  const handleToggle = (index: number) => {
    setToggle((prev) => ({
      ...prev, // Spread previous state correctly
      [index]: !prev[index], // Use prev to ensure correct state update
    }));
  };

  return (
    <div key={id} className="folder__main_div">
      <p className="folder">
        {isFolder && (
          <span onClick={() => handleToggle(id)}>{toggle[id] ? "-" : "+"}</span>
        )}
        {name}
        {isFolder && (
          <AiFillFolderAdd
            title="Create Folder"
            className="add__folder__btn"
            onClick={() => insertNewFolder(id)}
          />
        )}
        <MdDeleteOutline
          title="Delete File/Folder"
          className="delete__folder__btn"
          onClick={() => deleteFolder(id)}
        />
      </p>
      <div className="sub-folder">
        {isFolder && toggle[id] && (
          <div>
            {children?.map((item) => {
              return (
                <ListData
                  key={id}
                  deleteFolder={deleteFolder}
                  insertNewFolder={insertNewFolder}
                  data={item}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function App() {
  const [data, setData] = useState(json);

  const handleNewData = (index: number) => {
    const name = window.prompt("Enter Folder Name");

    const newData = {
      id: Date.now(),
      name: name,
      isFolder: true,
      children: [],
    };

    function updateData(data) {
      return data.map((item) => {
        if (item.id === index) {
          return {
            ...item,
            children: [...item.children, newData],
          };
        }

        if (item.children) {
          return {
            ...item,
            children: updateData(item.children),
          };
        }

        return item;
      });
    }

    setData(updateData(data));
  };

  const createFolder = () => {
    let name = window.prompt("Enter Folder name");

    let data = {
      id: Date.now(),
      name: name,
      isFolder: true,
      children: [],
    };

    setData([data]);
  };

  const deleteData = (index: number) => {
    const deleteFolder = (data) => {
      return data
        .filter((item) => item.id !== index)
        .map((item) => {
          return {
            ...item,
            children: item.children ? deleteFolder(item.children) : [],
          };
        });
    };

    setData(deleteFolder(data));
  };

  return (
    <div className="main__div">
      <h2 className="header">File/Folder Explorer</h2>

      <div className="folder__div">
        {data.length <= 0 && (
          <button onClick={createFolder} className="create__folder__btn">
            Create Folder
          </button>
        )}

        {data.map((item) => {
          return (
            <ListData
              key={item.id}
              deleteFolder={(id: number) => deleteData(id)}
              insertNewFolder={(id: number) => handleNewData(id)}
              data={item}
            />
          );
        })}
      </div>
    </div>
  );
}

export default App;
